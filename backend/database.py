@@ .. @@
 import sqlite3
 import json
 import os
 from datetime import datetime
 from werkzeug.security import generate_password_hash
 
-# Database configuration
-DATABASE = 'edunova.db'
+# Database configuration - store in separate data directory
+DATABASE_DIR = 'data'
+DATABASE = os.path.join(DATABASE_DIR, 'edunova.db')
+
+def ensure_data_directory():
+    """Ensure the data directory exists"""
+    if not os.path.exists(DATABASE_DIR):
+        os.makedirs(DATABASE_DIR)
 
 def get_db_connection():
+    ensure_data_directory()
     conn = sqlite3.connect(DATABASE)
     conn.row_factory = sqlite3.Row
     return conn