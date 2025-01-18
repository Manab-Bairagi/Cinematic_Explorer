from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from functools import wraps
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime, timedelta  # Corrected import statement
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
TMDB_API_KEY = os.getenv('TMDB_API_KEY', '8265bd1679663a7ea12ac168da84d2e8')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'


# Running backend and frontend on the same localhost
frontend_folder= os.path.join(os.getcwd(),"..","frontend")
dist_folder =os.path.join(frontend_folder,"dist")

#Server static files from the "dist" folder in frontend dir
@app.route("/",defaults={"filename":""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename="index.html"
    return send_from_directory(dist_folder,filename)



# In-memory cache
cache = {}

def cache_response(timeout=3600):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Create a cache key from the endpoint, arguments, and query parameters
            cache_key = f"{request.path}:{request.query_string.decode('utf-8')}"
            
            # Check if the response is already cached
            if cache_key in cache:
                cached_data, expiry = cache[cache_key]
                if datetime.now() < expiry:
                    print(f"Serving cached response for {cache_key}")  # Debug log
                    return jsonify(cached_data)
                else:
                    # Remove expired cache
                    del cache[cache_key]
            
            # Get the actual response
            response = f(*args, **kwargs)
            
            # Cache the response with an expiry time
            cache[cache_key] = (response, datetime.now() + timedelta(seconds=timeout))
            
            print(f"Caching response for {cache_key}")  # Debug log
            return jsonify(response)
        return decorated_function
    return decorator

def rate_limit(limit=100, per=3600):
    usage = {}

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client IP
            ip = request.remote_addr
            
            # Get the current timestamp
            current_time = datetime.now().timestamp()
            
            # Clean up old usage data
            usage[ip] = [t for t in usage.get(ip, []) if t > current_time - per]
            
            # Check the current rate limit
            if len(usage[ip]) >= limit:
                return jsonify({'error': 'Rate limit exceeded'}), 429
            
            # Add the current request timestamp
            usage[ip].append(current_time)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def tmdb_request(endpoint, params=None):
    """Make a request to TMDB API"""
    if params is None:
        params = {}
    
    params['api_key'] = TMDB_API_KEY
    
    response = requests.get(f'{TMDB_BASE_URL}{endpoint}', params=params)
    response.raise_for_status()
    
    return response.json()

@app.route('/api/movies/search')
@rate_limit()
@cache_response()
def search_movies():
    query = request.args.get('query')
    page = request.args.get('page', 1)
    with_genres = request.args.get('with_genres')
    
    if not query and not with_genres:
        return {'error': 'Query parameter or genre filter is required'}, 400
    
    try:
        # If we have a genre filter, use discover endpoint instead of search
        if with_genres:
            return tmdb_request('/discover/movie', {
                'with_genres': with_genres,
                'page': page,
                'sort_by': 'popularity.desc'
            })
        return tmdb_request('/search/movie', {'query': query, 'page': page})
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}, 500

@app.route('/api/movies/genres')
@rate_limit()
@cache_response(timeout=86400)  # Cache genres for 24 hours
def get_genres():
    try:
        return tmdb_request('/genre/movie/list')
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}, 500

@app.route('/api/movies/discover/<int:genre_id>')
@rate_limit()
@cache_response()
def discover_movies_by_genre(genre_id):
    page = request.args.get('page', 1)
    try:
        return tmdb_request('/discover/movie', {
            'with_genres': genre_id,
            'page': page,
            'sort_by': 'popularity.desc'
        })
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}, 500

@app.route('/api/movies/<int:movie_id>')
@rate_limit()
@cache_response()
def get_movie_details(movie_id):
    try:
        # Fetch movie details
        movie = tmdb_request(f'/movie/{movie_id}')
        
        # Fetch credits (cast and crew information)
        credits = tmdb_request(f'/movie/{movie_id}/credits')
        
        # Extract cast information
        cast = credits.get('cast', [])
        top_cast = [
            {
                "name": member.get("name"),
                "character": member.get("character"),
                "profile_path": member.get("profile_path"),
            }
            for member in cast[:5]  # Limit to top 5 cast members
        ]
        
        # Add cast to movie details
        movie['cast'] = top_cast
        
        return movie
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}, 500

@app.route('/api/movies/<int:movie_id>/recommendations')
@rate_limit()
@cache_response()
def get_recommendations(movie_id):
    page = request.args.get('page', 1)
    
    try:
        return tmdb_request(f'/movie/{movie_id}/recommendations', {'page': page})
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}, 500

@app.route('/api/movies/trending')
@rate_limit()
@cache_response()
def get_trending_movies():
    try:
        return tmdb_request('/trending/movie/day')
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}, 500

@app.route('/api/movies/suggestions')
@rate_limit()
@cache_response()
def get_suggestions():
    query = request.args.get('query')
    
    if not query:
        return {'error': 'Query parameter is required'}, 400
    
    try:
        search_results = tmdb_request('/search/movie', {'query': query, 'page': 1})
        suggestions = [movie['title'] for movie in search_results.get('results', [])[:10]]
        return jsonify(suggestions)
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}, 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# In a production environment, use a secure secret key
SECRET_KEY = "your-secret-key"

# Temporary user storage (replace with a database in production)
users = {}

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    if email in users:
        return jsonify({"error": "User already exists"}), 400
    
    users[email] = {
        "password": password,  # In production, hash the password
        "name": name
    }
    
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = users.get(email)
    if not user or user['password'] != password:
        return jsonify({"error": "Invalid credentials"}), 401
    
    token = jwt.encode({
        'email': email,
        'name': user['name'],
        'exp': datetime.utcnow() + timedelta(hours=24)  # Use datetime.utcnow() directly
    }, SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        "token": token,
        "user": {
            "email": email,
            "name": user['name']
        }
    }), 200

if __name__ == '__main__':
    app.run(debug=True)