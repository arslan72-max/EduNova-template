from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load data from JSON files
def load_json_data(filename):
    try:
        with open(f'../src/assets/data/{filename}', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

# Authentication endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    accounts_data = load_json_data('accounts.json')
    accounts = accounts_data.get('accounts', [])
    
    user = next((account for account in accounts if account['email'] == email and account['password'] == password), None)
    
    if user:
        user_data = {
            'id': user['id'],
            'fullName': user['fullName'],
            'email': user['email'],
            'avatar': user['avatar'],
            'level': user['level'],
            'specialty': user['specialty'],
            'joinDate': user['joinDate']
        }
        return jsonify({'user': user_data, 'token': 'mock-jwt-token'}), 200
    else:
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    accounts_data = load_json_data('accounts.json')
    accounts = accounts_data.get('accounts', [])
    
    # Check if user already exists
    existing_user = next((account for account in accounts if account['email'] == data['email']), None)
    if existing_user:
        return jsonify({'error': 'Un compte avec cet email existe déjà'}), 400
    
    # Create new user
    new_user = {
        'id': len(accounts) + 1,
        'fullName': data['fullName'],
        'email': data['email'],
        'avatar': get_random_avatar(),
        'level': data['level'],
        'specialty': data['specialty'],
        'joinDate': datetime.now().strftime('%Y-%m-%d')
    }
    
    return jsonify({'user': new_user, 'token': 'mock-jwt-token'}), 201

def get_random_avatar():
    avatars = [
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    ]
    import random
    return random.choice(avatars)

# Content endpoints
@app.route('/api/documents', methods=['GET'])
def get_documents():
    documents_data = load_json_data('documents.json')
    documents = documents_data.get('documents', [])
    
    # Apply filters
    search = request.args.get('search', '').lower()
    subject = request.args.get('subject', '')
    level = request.args.get('level', '')
    doc_type = request.args.get('type', '')
    
    if search:
        documents = [doc for doc in documents if 
                    search in doc['title'].lower() or 
                    search in doc['description'].lower() or 
                    search in doc['subject'].lower()]
    
    if subject:
        documents = [doc for doc in documents if doc['subject'] == subject]
    
    if level:
        documents = [doc for doc in documents if doc['level'] == level]
    
    if doc_type:
        documents = [doc for doc in documents if doc['type'] == doc_type]
    
    return jsonify({'documents': documents})

@app.route('/api/videos', methods=['GET'])
def get_videos():
    videos_data = load_json_data('videos.json')
    videos = videos_data.get('videos', [])
    
    # Apply filters
    search = request.args.get('search', '').lower()
    subject = request.args.get('subject', '')
    level = request.args.get('level', '')
    
    if search:
        videos = [video for video in videos if 
                 search in video['title'].lower() or 
                 search in video['description'].lower() or 
                 search in video['subject'].lower()]
    
    if subject:
        videos = [video for video in videos if video['subject'] == subject]
    
    if level:
        videos = [video for video in videos if video['level'] == level]
    
    return jsonify({'videos': videos})

# User data endpoints
@app.route('/api/user/stats', methods=['GET'])
def get_user_stats():
    # Mock user statistics
    return jsonify({
        'courses': 24,
        'exercises': 156,
        'successRate': 89,
        'hoursThisWeek': 12
    })

@app.route('/api/user/settings', methods=['GET'])
def get_user_settings():
    # Mock user settings
    return jsonify({
        'theme': 'auto',
        'language': 'fr',
        'notifications': {
            'email': True,
            'push': True,
            'newCourses': True,
            'reminders': False
        },
        'privacy': {
            'profileVisibility': 'public',
            'showProgress': True,
            'allowMessages': True
        },
        'preferences': {
            'autoplay': False,
            'subtitles': True,
            'playbackSpeed': 1,
            'downloadQuality': 'medium'
        }
    })

@app.route('/api/user/settings', methods=['PUT'])
def update_user_settings():
    settings = request.get_json()
    # In a real app, save to database
    return jsonify({'message': 'Settings updated successfully'})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Backend is running'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)