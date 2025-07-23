#!/usr/bin/env python3
"""
PostgreSQL Database Setup Script for Flask News Analysis API
"""

import psycopg2
import psycopg2.extensions
import os
import sys
import subprocess
import json

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres'),
    'port': os.getenv('DB_PORT', '5432')
}

DATABASE_NAME = os.getenv('DB_NAME', 'news_analysis')

def check_postgresql_running():
    """Check if PostgreSQL is running"""
    try:
        # Try to connect to PostgreSQL server (without specifying database)
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            port=DB_CONFIG['port']
        )
        conn.close()
        return True
    except psycopg2.OperationalError as e:
        print(f"❌ PostgreSQL connection failed: {str(e)}")
        return False

def create_database():
    """Create the news_analysis database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (default postgres database)
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            port=DB_CONFIG['port'],
            database='postgres'
        )
        conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(
            "SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s",
            (DATABASE_NAME,)
        )
        exists = cursor.fetchone()
        
        if not exists:
            print(f"📊 Creating database '{DATABASE_NAME}'...")
            cursor.execute(f'CREATE DATABASE "{DATABASE_NAME}"')
            print(f"✅ Database '{DATABASE_NAME}' created successfully")
        else:
            print(f"✅ Database '{DATABASE_NAME}' already exists")
        
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Error creating database: {str(e)}")
        return False

def test_database_connection():
    """Test connection to the news_analysis database"""
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            port=DB_CONFIG['port'],
            database=DATABASE_NAME
        )
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        version = cursor.fetchone()
        print(f"✅ Connected to PostgreSQL: {version[0]}")
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"❌ Database connection test failed: {str(e)}")
        return False

def install_postgresql_ubuntu():
    """Install PostgreSQL on Ubuntu/Debian systems"""
    print("🔧 Installing PostgreSQL...")
    try:
        subprocess.run(['sudo', 'apt', 'update'], check=True)
        subprocess.run(['sudo', 'apt', 'install', '-y', 'postgresql', 'postgresql-contrib'], check=True)
        subprocess.run(['sudo', 'systemctl', 'start', 'postgresql'], check=True)
        subprocess.run(['sudo', 'systemctl', 'enable', 'postgresql'], check=True)
        print("✅ PostgreSQL installed and started")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install PostgreSQL: {str(e)}")
        return False

def setup_postgresql_user():
    """Setup PostgreSQL user and password"""
    print("👤 Setting up PostgreSQL user...")
    try:
        # Change to postgres user and create/modify user
        commands = [
            f"sudo -u postgres psql -c \"ALTER USER postgres PASSWORD '{DB_CONFIG['password']}';\""
        ]
        
        for cmd in commands:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"Warning: {result.stderr}")
        
        print("✅ PostgreSQL user setup completed")
        return True
    except Exception as e:
        print(f"❌ Failed to setup PostgreSQL user: {str(e)}")
        return False

def create_env_file():
    """Create .env file with database configuration"""
    env_content = f"""# PostgreSQL Database Configuration
DB_HOST={DB_CONFIG['host']}
DB_NAME={DATABASE_NAME}
DB_USER={DB_CONFIG['user']}
DB_PASSWORD={DB_CONFIG['password']}
DB_PORT={DB_CONFIG['port']}
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Created .env file with database configuration")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {str(e)}")
        return False

def main():
    """Main setup function"""
    print("🐘 PostgreSQL Setup for Flask News Analysis API")
    print("=" * 50)
    
    # Check if PostgreSQL is running
    print("1. Checking PostgreSQL connection...")
    if not check_postgresql_running():
        print("\n💡 PostgreSQL is not running or not installed.")
        print("Would you like to install PostgreSQL? (Ubuntu/Debian only)")
        choice = input("Install PostgreSQL? (y/N): ").strip().lower()
        
        if choice == 'y':
            if not install_postgresql_ubuntu():
                print("\n❌ Failed to install PostgreSQL automatically.")
                print("Please install PostgreSQL manually:")
                print("  sudo apt update")
                print("  sudo apt install postgresql postgresql-contrib")
                print("  sudo systemctl start postgresql")
                return False
            
            if not setup_postgresql_user():
                print("⚠️  User setup had issues, but continuing...")
        else:
            print("\n📖 Manual PostgreSQL setup instructions:")
            print("1. Install PostgreSQL:")
            print("   sudo apt install postgresql postgresql-contrib")
            print("2. Start PostgreSQL:")
            print("   sudo systemctl start postgresql")
            print("3. Set password for postgres user:")
            print("   sudo -u postgres psql -c \"ALTER USER postgres PASSWORD 'postgres';\"")
            return False
    
    # Create database
    print("\n2. Setting up database...")
    if not create_database():
        return False
    
    # Test connection
    print("\n3. Testing database connection...")
    if not test_database_connection():
        return False
    
    # Create .env file
    print("\n4. Creating configuration file...")
    create_env_file()
    
    print("\n🎉 PostgreSQL setup completed successfully!")
    print("\n📋 Database Configuration:")
    print(f"   Host: {DB_CONFIG['host']}")
    print(f"   Database: {DATABASE_NAME}")
    print(f"   User: {DB_CONFIG['user']}")
    print(f"   Port: {DB_CONFIG['port']}")
    
    print("\n🚀 Next steps:")
    print("1. Run the Flask application:")
    print("   ./run.sh")
    print("2. Or manually:")
    print("   source venv/bin/activate")
    print("   python3 app.py")
    
    return True

if __name__ == "__main__":
    if not main():
        sys.exit(1)