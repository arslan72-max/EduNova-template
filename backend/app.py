from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import json
import os
from datetime import datetime, timedelta
import jwt
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
CORS(app, supports_credentials=True, origins=['http://localhost:4200'])

# Database configuration
DATABASE = 'edunova.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with tables"""
    conn = get_db_connection()
    
    # Users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            avatar TEXT,
            level TEXT,
            specialty TEXT,
            join_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # User settings table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS user_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            theme TEXT DEFAULT 'auto',
            language TEXT DEFAULT 'fr',
            email_notifications BOOLEAN DEFAULT 1,
            push_notifications BOOLEAN DEFAULT 1,
            new_courses_notifications BOOLEAN DEFAULT 1,
            reminders BOOLEAN DEFAULT 0,
            profile_visibility TEXT DEFAULT 'public',
            show_progress BOOLEAN DEFAULT 1,
            allow_messages BOOLEAN DEFAULT 1,
            autoplay BOOLEAN DEFAULT 0,
            subtitles BOOLEAN DEFAULT 1,
            playback_speed REAL DEFAULT 1.0,
            download_quality TEXT DEFAULT 'medium',
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Documents table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            subject TEXT NOT NULL,
            level TEXT NOT NULL,
            thumbnail TEXT,
            description TEXT,
            pages INTEGER,
            download_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Videos table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            level TEXT NOT NULL,
            duration TEXT,
            thumbnail TEXT,
            description TEXT,
            views INTEGER DEFAULT 0,
            video_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # User progress table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS user_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            content_type TEXT, -- 'document' or 'video'
            content_id INTEGER,
            progress REAL DEFAULT 0.0,
            completed BOOLEAN DEFAULT 0,
            last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def seed_data():
    """Seed the database with initial data"""
    conn = get_db_connection()
    
    # Check if data already exists
    existing_users = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    if existing_users > 0:
        conn.close()
        return
    
    # Insert demo users
    demo_users = [
        {
            'full_name': 'Ahmed Ben Ali',
            'email': 'ahmed.benali@email.com',
            'password': 'password123',
            'avatar': 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            'level': 'Terminale',
            'specialty': 'Sciences Mathématiques',
            'join_date': '2024-01-15'
        },
        {
            'full_name': 'Fatima Trabelsi',
            'email': 'fatima.trabelsi@email.com',
            'password': 'password123',
            'avatar': 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            'level': '1ère année Prépa',
            'specialty': 'Physique-Chimie',
            'join_date': '2024-02-20'
        },
        {
            'full_name': 'Mohamed Khelifi',
            'email': 'mohamed.khelifi@email.com',
            'password': 'password123',
            'avatar': 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            'level': '2ème année Prépa',
            'specialty': 'Mathématiques-Informatique',
            'join_date': '2023-09-10'
        },
        {
            'full_name': 'Salma Bouazizi',
            'email': 'salma.bouazizi@email.com',
            'password': 'password123',
            'avatar': 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            'level': 'Terminale',
            'specialty': 'Sciences Expérimentales',
            'join_date': '2024-03-05'
        },
        {
            'full_name': 'Youssef Mansouri',
            'email': 'youssef.mansouri@email.com',
            'password': 'password123',
            'avatar': 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            'level': '1ère année Université',
            'specialty': 'Informatique',
            'join_date': '2023-11-12'
        },
        {
            'full_name': 'Raslene Haddaji',
            'email': 'raslene.haddaji@email.com',
            'password': 'password123',
            'avatar': '/assets/IMG_20250205_191659_196~4.jpg',
            'level': 'Prépa',
            'specialty': 'Technologie',
            'join_date': '2024-04-26'
        }
    ]
    
    for user in demo_users:
        password_hash = generate_password_hash(user['password'])
        conn.execute('''
            INSERT INTO users (full_name, email, password_hash, avatar, level, specialty, join_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user['full_name'], user['email'], password_hash, user['avatar'], 
              user['level'], user['specialty'], user['join_date']))
        
        # Create default settings for each user
        user_id = conn.lastrowid
        conn.execute('''
            INSERT INTO user_settings (user_id) VALUES (?)
        ''', (user_id,))
    
    # Insert demo documents
    documents = [
        {
            'title': 'Analyse Mathématique - Limites et Continuité',
            'type': 'cours',
            'subject': 'Mathématiques',
            'level': 'Terminale',
            'thumbnail': 'https://images.pexels.com/photos/6256/mathematics-blackboard-education-classroom.jpg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Cours complet sur les limites et la continuité des fonctions',
            'pages': 45,
            'download_url': '#'
        },
        {
            'title': 'Physique Quantique - Introduction',
            'type': 'cours',
            'subject': 'Physique',
            'level': 'Prépa',
            'thumbnail': 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Les bases de la mécanique quantique',
            'pages': 67,
            'download_url': '#'
        },
        {
            'title': 'Exercices Corrigés - Algèbre Linéaire',
            'type': 'exercices',
            'subject': 'Mathématiques',
            'level': 'Prépa',
            'thumbnail': 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': '50 exercices corrigés d\'algèbre linéaire',
            'pages': 89,
            'download_url': '#'
        },
        {
            'title': 'Chimie Organique - Réactions',
            'type': 'fiches',
            'subject': 'Chimie',
            'level': 'Terminale',
            'thumbnail': 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Fiches de révision sur les réactions organiques',
            'pages': 23,
            'download_url': '#'
        },
        {
            'title': 'Programmation Python - Structures de Données',
            'type': 'cours',
            'subject': 'Informatique',
            'level': 'Université',
            'thumbnail': 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Guide complet des structures de données en Python',
            'pages': 112,
            'download_url': '#'
        },
        {
            'title': 'Histoire de la Tunisie Moderne',
            'type': 'cours',
            'subject': 'Histoire',
            'level': 'Terminale',
            'thumbnail': 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'L\'évolution de la Tunisie au XXe siècle',
            'pages': 78,
            'download_url': '#'
        }
    ]
    
    for doc in documents:
        conn.execute('''
            INSERT INTO documents (title, type, subject, level, thumbnail, description, pages, download_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (doc['title'], doc['type'], doc['subject'], doc['level'], 
              doc['thumbnail'], doc['description'], doc['pages'], doc['download_url']))
    
    # Insert demo videos
    videos = [
        {
            'title': 'Dérivées et Applications - Cours Complet',
            'subject': 'Mathématiques',
            'level': 'Terminale',
            'duration': '45:30',
            'thumbnail': 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Maîtrisez les dérivées et leurs applications pratiques',
            'views': 12500,
            'video_url': '#'
        },
        {
            'title': 'Électromagnétisme - Lois de Maxwell',
            'subject': 'Physique',
            'level': 'Prépa',
            'duration': '38:15',
            'thumbnail': 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Comprendre les équations de Maxwell',
            'views': 8900,
            'video_url': '#'
        },
        {
            'title': 'Algorithmes de Tri - Comparaison',
            'subject': 'Informatique',
            'level': 'Université',
            'duration': '52:20',
            'thumbnail': 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Analyse des différents algorithmes de tri',
            'views': 15600,
            'video_url': '#'
        },
        {
            'title': 'Réactions Acide-Base',
            'subject': 'Chimie',
            'level': 'Terminale',
            'duration': '29:45',
            'thumbnail': 'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Les équilibres acide-base expliqués',
            'views': 7800,
            'video_url': '#'
        },
        {
            'title': 'Analyse Littéraire - Méthodes',
            'subject': 'Français',
            'level': 'Terminale',
            'duration': '41:10',
            'thumbnail': 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Techniques d\'analyse des textes littéraires',
            'views': 9200,
            'video_url': '#'
        },
        {
            'title': 'Géométrie dans l\'Espace',
            'subject': 'Mathématiques',
            'level': 'Prépa',
            'duration': '56:30',
            'thumbnail': 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
            'description': 'Maîtriser la géométrie en 3D',
            'views': 11400,
            'video_url': '#'
        }
    ]
    
    for video in videos:
        conn.execute('''
            INSERT INTO videos (title, subject, level, duration, thumbnail, description, views, video_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (video['title'], video['subject'], video['level'], video['duration'],
              video['thumbnail'], video['description'], video['views'], video['video_url']))
    
    conn.commit()
    conn.close()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

# Authentication routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400
    
    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM users WHERE email = ?', (email,)
    ).fetchone()
    conn.close()
    
    if user and check_password_hash(user['password_hash'], password):
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'fullName': user['full_name'],
                'email': user['email'],
                'avatar': user['avatar'],
                'level': user['level'],
                'specialty': user['specialty'],
                'joinDate': user['join_date']
            }
        })
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')
    level = data.get('level', 'Non spécifié')
    specialty = data.get('specialty', 'Non spécifié')
    
    if not all([full_name, email, password]):
        return jsonify({'message': 'All fields required'}), 400
    
    # Validate email format
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return jsonify({'message': 'Invalid email format'}), 400
    
    # Validate password strength
    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters long'}), 400
    
    conn = get_db_connection()
    
    # Check if user already exists
    existing_user = conn.execute(
        'SELECT id FROM users WHERE email = ?', (email,)
    ).fetchone()
    
    if existing_user:
        conn.close()
        return jsonify({'message': 'User already exists'}), 400
    
    # Create new user
    password_hash = generate_password_hash(password)
    join_date = datetime.now().strftime('%Y-%m-%d')
    
    # Default avatar based on name
    default_avatars = [
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    ]
    avatar = default_avatars[hash(email) % len(default_avatars)]
    
    cursor = conn.execute('''
        INSERT INTO users (full_name, email, password_hash, avatar, level, specialty, join_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (full_name, email, password_hash, avatar, level, specialty, join_date))
    
    user_id = cursor.lastrowid
    
    # Create default settings
    conn.execute('INSERT INTO user_settings (user_id) VALUES (?)', (user_id,))
    conn.commit()
    
    # Get the created user
    user = conn.execute(
        'SELECT * FROM users WHERE id = ?', (user_id,)
    ).fetchone()
    conn.close()
    

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user_id):
    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM users WHERE id = ?', (current_user_id,)
    ).fetchone()
    conn.close()
    
    if user:
        return jsonify({
            'id': user['id'],
            'fullName': user['full_name'],
            'email': user['email'],
            'avatar': user['avatar'],
            'level': user['level'],
            'specialty': user['specialty'],
            'joinDate': user['join_date']
        })
    
    return jsonify({'message': 'User not found'}), 404

# Content routes
@app.route('/api/documents', methods=['GET'])
def get_documents():
    search = request.args.get('search', '')
    subject = request.args.get('subject', '')
    level = request.args.get('level', '')
    doc_type = request.args.get('type', '')
    
    conn = get_db_connection()
    query = 'SELECT * FROM documents WHERE 1=1'
    params = []
    
    if search:
        query += ' AND (title LIKE ? OR description LIKE ? OR subject LIKE ?)'
        search_param = f'%{search}%'
        params.extend([search_param, search_param, search_param])
    
    if subject:
        query += ' AND subject = ?'
        params.append(subject)
    
    if level:
        query += ' AND level = ?'
        params.append(level)
    
    if doc_type:
        query += ' AND type = ?'
        params.append(doc_type)
    
    query += ' ORDER BY created_at DESC'
    
    documents = conn.execute(query, params).fetchall()
    conn.close()
    
    return jsonify({
        'documents': [dict(doc) for doc in documents]
    })

@app.route('/api/videos', methods=['GET'])
def get_videos():
    search = request.args.get('search', '')
    subject = request.args.get('subject', '')
    level = request.args.get('level', '')
    
    conn = get_db_connection()
    query = 'SELECT * FROM videos WHERE 1=1'
    params = []
    
    if search:
        query += ' AND (title LIKE ? OR description LIKE ? OR subject LIKE ?)'
        search_param = f'%{search}%'
        params.extend([search_param, search_param, search_param])
    
    if subject:
        query += ' AND subject = ?'
        params.append(subject)
    
    if level:
        query += ' AND level = ?'
        params.append(level)
    
    query += ' ORDER BY created_at DESC'
    
    videos = conn.execute(query, params).fetchall()
    conn.close()
    
    return jsonify({
        'videos': [dict(video) for video in videos]
    })

# Settings routes
@app.route('/api/settings', methods=['GET'])
@token_required
def get_settings(current_user_id):
    conn = get_db_connection()
    settings = conn.execute(
        'SELECT * FROM user_settings WHERE user_id = ?', (current_user_id,)
    ).fetchone()
    conn.close()
    
    if settings:
        return jsonify({
            'theme': settings['theme'],
            'language': settings['language'],
            'notifications': {
                'email': bool(settings['email_notifications']),
                'push': bool(settings['push_notifications']),
                'newCourses': bool(settings['new_courses_notifications']),
                'reminders': bool(settings['reminders'])
            },
            'privacy': {
                'profileVisibility': settings['profile_visibility'],
                'showProgress': bool(settings['show_progress']),
                'allowMessages': bool(settings['allow_messages'])
            },
            'preferences': {
                'autoplay': bool(settings['autoplay']),
                'subtitles': bool(settings['subtitles']),
                'playbackSpeed': settings['playback_speed'],
                'downloadQuality': settings['download_quality']
            }
        })
    
    return jsonify({'message': 'Settings not found'}), 404

@app.route('/api/settings', methods=['PUT'])
@token_required
def update_settings(current_user_id):
    data = request.get_json()
    
    conn = get_db_connection()
    conn.execute('''
        UPDATE user_settings SET
            theme = ?,
            language = ?,
            email_notifications = ?,
            push_notifications = ?,
            new_courses_notifications = ?,
            reminders = ?,
            profile_visibility = ?,
            show_progress = ?,
            allow_messages = ?,
            autoplay = ?,
            subtitles = ?,
            playback_speed = ?,
            download_quality = ?
        WHERE user_id = ?
    ''', (
        data.get('theme'),
        data.get('language'),
        data.get('notifications', {}).get('email'),
        data.get('notifications', {}).get('push'),
        data.get('notifications', {}).get('newCourses'),
        data.get('notifications', {}).get('reminders'),
        data.get('privacy', {}).get('profileVisibility'),
        data.get('privacy', {}).get('showProgress'),
        data.get('privacy', {}).get('allowMessages'),
        data.get('preferences', {}).get('autoplay'),
        data.get('preferences', {}).get('subtitles'),
        data.get('preferences', {}).get('playbackSpeed'),
        data.get('preferences', {}).get('downloadQuality'),
        current_user_id
    ))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Settings updated successfully'})

# Progress tracking routes
@app.route('/api/progress', methods=['GET'])
@token_required
def get_user_progress(current_user_id):
    conn = get_db_connection()
    progress = conn.execute('''
        SELECT content_type, content_id, progress, completed, last_accessed
        FROM user_progress 
        WHERE user_id = ?
    ''', (current_user_id,)).fetchall()
    conn.close()
    
    return jsonify({
        'progress': [dict(p) for p in progress]
    })

@app.route('/api/progress', methods=['POST'])
@token_required
def update_progress(current_user_id):
    data = request.get_json()
    content_type = data.get('contentType')
    content_id = data.get('contentId')
    progress = data.get('progress', 0)
    completed = data.get('completed', False)
    
    conn = get_db_connection()
    
    # Check if progress record exists
    existing = conn.execute('''
        SELECT id FROM user_progress 
        WHERE user_id = ? AND content_type = ? AND content_id = ?
    ''', (current_user_id, content_type, content_id)).fetchone()
    
    if existing:
        conn.execute('''
            UPDATE user_progress SET
                progress = ?, completed = ?, last_accessed = CURRENT_TIMESTAMP
            WHERE user_id = ? AND content_type = ? AND content_id = ?
        ''', (progress, completed, current_user_id, content_type, content_id))
    else:
        conn.execute('''
            INSERT INTO user_progress (user_id, content_type, content_id, progress, completed)
            VALUES (?, ?, ?, ?, ?)
        ''', (current_user_id, content_type, content_id, progress, completed))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Progress updated successfully'})

# Statistics routes
@app.route('/api/stats', methods=['GET'])
@token_required
def get_user_stats(current_user_id):
    conn = get_db_connection()
    
    # Get completed courses count
    completed_courses = conn.execute('''
        SELECT COUNT(*) FROM user_progress 
        WHERE user_id = ? AND content_type = 'document' AND completed = 1
    ''', (current_user_id,)).fetchone()[0]
    
    # Get completed exercises count
    completed_exercises = conn.execute('''
        SELECT COUNT(*) FROM user_progress 
        WHERE user_id = ? AND content_type = 'document' AND completed = 1
    ''', (current_user_id,)).fetchone()[0]
    
    # Calculate success rate (simplified)
    total_attempts = conn.execute('''
        SELECT COUNT(*) FROM user_progress WHERE user_id = ?
    ''', (current_user_id,)).fetchone()[0]
    
    success_rate = 89 if total_attempts > 0 else 0  # Simplified calculation
    
    conn.close()
    
    return jsonify({
        'courses': completed_courses,
        'exercises': completed_exercises,
        'successRate': success_rate,
        'hoursThisWeek': 12  # This would be calculated based on actual usage
    })

if __name__ == '__main__':
    init_db()
    seed_data()
    app.run(debug=True, port=5000)