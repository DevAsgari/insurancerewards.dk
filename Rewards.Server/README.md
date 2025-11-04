# Rewards Server

ASP.NET Core Web API for managing sales and calculating rewards.

## Prerequisites

- .NET 8.0 SDK
- MySQL 8.0+
- Visual Studio 2022 / Rider / VS Code (optional)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Rewards/Rewards.Server
```

### 2. Configure Database Connection

Copy the example configuration files and add your database credentials:

```bash
# For Development
cp appsettings.Development.example.json appsettings.Development.json

# For Production
cp appsettings.Production.example.json appsettings.Production.json
```

Edit the files and replace the placeholder values with your actual database connection details:
- Server: Your MySQL server address
- Database: Database name
- User: Database username
- Password: Database password

### 3. Apply Database Migrations

```bash
dotnet ef database update
```

### 4. Run the Application

```bash
# Development mode
dotnet run

# Or with watch (auto-reload)
dotnet watch run
```

The API will be available at:
- HTTPS: https://localhost:7174
- HTTP: http://localhost:5230
- Swagger UI: https://localhost:7174/swagger

## Project Structure

```
Rewards.Server/
├── Configuration/     # AutoMapper profiles
├── Controllers/       # API endpoints
├── Data/              # DbContext
├── DTOs/              # Data Transfer Objects
├── Entities/          # Database models
├── Middleware/        # Global exception handling
├── Migrations/        # EF Core migrations
├── Repositories/      # Data access layer
├── Services/          # Business logic
├── Strategies/        # Reward calculation strategies
└── Validation/        # Input validation
```

## API Endpoints

### Health Check
- `GET /health` - Check API and database status

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/{id}` - Get sale by ID
- `POST /api/sales` - Create new sale
- `PUT /api/sales/{id}` - Update existing sale
- `DELETE /api/sales/{id}` - Delete sale

See Swagger UI for detailed API documentation when running in development mode.

## Configuration Files

- `appsettings.json` - Base configuration (committed to git)
- `appsettings.Development.json` - Development settings (ignored by git)
- `appsettings.Production.json` - Production settings (ignored by git)
- `*.example.json` - Template files for developers

## Security Notes

Never commit files containing sensitive information:
- `appsettings.Development.json`
- `appsettings.Production.json`
- `web.config`
- `*.user` files

These are already in `.gitignore`.

## Deployment

The application is configured for deployment on Simply.com shared hosting with IIS.

See `Properties/PublishProfiles/IISProfile.pubxml` for publish settings.

## Technologies Used

- ASP.NET Core 8.0
- Entity Framework Core
- MySQL / Pomelo.EntityFrameworkCore.MySql
- AutoMapper
- Swagger / OpenAPI
