# Migration Guide: SQLite to PostgreSQL

This guide helps you migrate from the previous SQLite-based version to the new PostgreSQL-based Flask News Analysis API.

## What Changed

### Database System
- **Before**: SQLite (`news_analysis.db` file)
- **After**: PostgreSQL server with `news_analysis` database

### Dependencies
- **Added**: `psycopg2-binary` for PostgreSQL connectivity
- **Added**: PostgreSQL server and development packages

### Configuration
- **Before**: Hardcoded database path
- **After**: Environment variables in `.env` file

## Migration Steps

### 1. Backup Existing Data (Optional)
If you have existing analysis results in SQLite:
```bash
# Backup your SQLite database
cp news_analysis.db news_analysis_backup.db
```

### 2. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Setup New Database
```bash
# Run the PostgreSQL setup script
python3 setup_postgres.py
```

This will:
- Create the `news_analysis` database
- Set up required tables with proper indexes
- Create `.env` configuration file
- Configure database user permissions

### 4. Install New Dependencies
```bash
# Install PostgreSQL development packages and Python dependencies
./install_deps.sh
```

Or manually:
```bash
sudo apt install postgresql-server-dev-all libpq-dev python3-dev
pip install psycopg2-binary==2.9.9
```

### 5. Update Application
The application will automatically:
- Read database configuration from `.env` file
- Create PostgreSQL tables on first run
- Load scraped data into PostgreSQL

### 6. Test the Migration
```bash
# Run the test script
python3 test_setup.py

# Start the application
./run.sh
```

## Key Differences

### Database Schema
The PostgreSQL schema includes improvements:
- `SERIAL` instead of `INTEGER PRIMARY KEY AUTOINCREMENT`
- Proper foreign key constraints with `REFERENCES`
- Additional indexes for better performance
- `ON CONFLICT` handling for duplicate data

### Connection Management
- Connection pooling support
- Environment-based configuration
- Better error handling for database operations
- Automatic connection cleanup

### Performance Improvements
- Faster queries with optimized indexes
- Better concurrent access support
- Improved transaction handling
- Connection reuse

## Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql

# Check if database exists
sudo -u postgres psql -l | grep news_analysis
```

### Permission Issues
```bash
# Reset PostgreSQL user password
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# Recreate database and permissions
python3 setup_postgres.py
```

### Dependency Installation Issues
```bash
# Install build dependencies
sudo apt install build-essential python3-dev

# Try alternative PostgreSQL adapter
pip uninstall psycopg2-binary
pip install psycopg2
```

### Port Conflicts
If PostgreSQL is running on a different port:
```bash
# Edit .env file
DB_PORT=5433  # or your PostgreSQL port

# Or set environment variable
export DB_PORT=5433
```

## Configuration Options

### Environment Variables
Create or edit `.env` file:
```bash
# Database connection settings
DB_HOST=localhost
DB_NAME=news_analysis
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432

# Optional: Connection pool settings
DB_MAX_CONNECTIONS=20
DB_MIN_CONNECTIONS=5
```

### Remote PostgreSQL
To connect to a remote PostgreSQL server:
```bash
# Update .env file
DB_HOST=your-postgres-server.com
DB_NAME=news_analysis
DB_USER=your_username
DB_PASSWORD=your_password
DB_PORT=5432
```

## Benefits of PostgreSQL Migration

### Scalability
- Better performance with large datasets
- Support for concurrent users
- Advanced query optimization

### Reliability
- ACID compliance for data integrity
- Better backup and recovery options
- Robust transaction handling

### Features
- Advanced data types and functions
- Full-text search capabilities
- JSON/JSONB support for future enhancements

### Production Ready
- Industry-standard database system
- Extensive monitoring and management tools
- High availability options

## Rollback (If Needed)

If you need to rollback to SQLite:
1. Keep your backup: `news_analysis_backup.db`
2. Checkout previous commit or restore old `app.py`
3. Remove PostgreSQL dependencies
4. Restore SQLite-based configuration

## Support

If you encounter issues during migration:
1. Run `python3 test_setup.py` to diagnose problems
2. Check PostgreSQL logs: `sudo journalctl -u postgresql`
3. Verify `.env` file configuration
4. Ensure all dependencies are installed with `./install_deps.sh`

The migration provides significant improvements in performance, scalability, and production readiness while maintaining the same API interface.