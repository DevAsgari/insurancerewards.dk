# Security Configuration Guide

## Environment Variables Setup

This application uses environment variables to protect sensitive information like database credentials.

### Development Setup

1. **Option 1: Use appsettings.Development.json (Current Setup)**
   - The `appsettings.Development.json` file contains your development database credentials
   - This file is excluded from git via `.gitignore`
   - **IMPORTANT**: Never commit this file to version control

2. **Option 2: Use Environment Variables**
   - Create a `.env` file in the root directory (see `.env.example`)
   - Set environment variables in your system or IDE

### Production Setup

For production deployment, set these environment variables:

```bash
ConnectionStrings__DefaultConnection="Server=your-server.com;Database=your_database;User=your_user;Password=your_password;Port=3306;"
Cors__AllowedOrigins__0="https://your-frontend-domain.com"
Cors__AllowedOrigins__1="https://www.your-frontend-domain.com"
ASPNETCORE_ENVIRONMENT=Production
```

### CORS Configuration

The application includes CORS (Cross-Origin Resource Sharing) configuration for both development and production:

**Development**: Allows requests from local frontend (https://localhost:55992, http://localhost:55992, etc.)

**Production**: Configured via `appsettings.Production.json` or environment variables
- Update `Cors:AllowedOrigins` array with your production frontend URLs
- Use environment variables for deployment:
  ```bash
  Cors__AllowedOrigins__0="https://yourdomain.com"
  Cors__AllowedOrigins__1="https://www.yourdomain.com"
  ```

### Setting Environment Variables

#### .NET Configuration Convention

.NET uses a special naming convention for environment variables. To override `ConnectionStrings:DefaultConnection`, use:

```
ConnectionStrings__DefaultConnection
```

Note the **double underscore** (`__`) which represents the JSON hierarchy separator.

#### Windows (PowerShell)
```powershell
$env:ConnectionStrings__DefaultConnection="Server=your-server.com;Database=your_database;User=your_user;Password=your_password;Port=3306;"
```

#### Windows (Command Prompt)
```cmd
set ConnectionStrings__DefaultConnection=Server=your-server.com;Database=your_database;User=your_user;Password=your_password;Port=3306;
```

#### Linux/macOS
```bash
export ConnectionStrings__DefaultConnection="Server=your-server.com;Database=your_database;User=your_user;Password=your_password;Port=3306;"
```

### Azure App Service

In Azure Portal:
1. Go to your App Service
2. Navigate to **Configuration** > **Application settings**
3. Add each environment variable as a new application setting
4. Save and restart the app

### Docker

Use environment variables in `docker run`:
```bash
docker run -e DB_SERVER=... -e DB_PASSWORD=... your-image
```

Or use a `.env` file with docker-compose:
```yaml
services:
  api:
    environment:
      - DB_SERVER=${DB_SERVER}
      - DB_PASSWORD=${DB_PASSWORD}
```

## Configuration Files

- **appsettings.json**: Base configuration with placeholders for environment variables
- **appsettings.Development.json**: Development-specific settings (excluded from git)
- **appsettings.Production.json**: Production-specific settings (excluded from git)

## Health Check Endpoint

The application includes a health check endpoint at `/health` that monitors:
- Application status
- Database connectivity (EF Core DbContext check)

Use this endpoint for:
- Load balancer health checks
- Monitoring and alerting systems
- Deployment verification

```bash
curl https://your-api-domain.com/health
```

Expected response: `Healthy`

## Security Features

The application includes the following security features:

1. ✅ **CORS Configuration**: Separate policies for development and production
2. ✅ **HSTS**: HTTP Strict Transport Security enabled in production
3. ✅ **Global Exception Handling**: Centralized error handling via middleware
4. ✅ **Health Checks**: Database connectivity monitoring
5. ✅ **Environment Variables**: Sensitive data stored outside source code
6. ✅ **HTTPS Enforcement**: SSL/TLS required for all connections

## Security Best Practices

1. ✅ **Never commit sensitive data** to version control
2. ✅ **Use different credentials** for development, staging, and production
3. ✅ **Rotate passwords** regularly
4. ✅ **Use Azure Key Vault** or similar for production secrets
5. ✅ **Enable SSL/TLS** for database connections in production
6. ✅ **Limit database user permissions** to minimum required
7. ✅ **Update CORS origins** to match your production frontend domain

## Files Excluded from Git

The following files are automatically excluded via `.gitignore`:

- `appsettings.Development.json`
- `appsettings.Production.json`
- `appsettings.*.json` (except base `appsettings.json`)
- `.env`
- `.env.local`
- `.env.*.local`

## Verifying Security

Before committing, always check:

```bash
# Check what files are staged
git status

# Ensure no sensitive files are included
git diff --cached
```

If you accidentally committed sensitive data:

```bash
# Remove from git but keep local file
git rm --cached appsettings.Development.json

# Update .gitignore and commit
git add .gitignore
git commit -m "Add security: exclude sensitive config files"
```

## Need Help?

If you've accidentally committed credentials:
1. **Immediately rotate** the compromised credentials
2. Remove sensitive data from git history (contact DevOps team)
3. Update `.gitignore` to prevent future incidents
