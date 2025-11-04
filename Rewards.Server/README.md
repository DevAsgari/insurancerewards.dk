# Insurance Rewards - Backend

ASP.NET Core Web API for managing insurance sales and calculating customer rewards.

## What it does

- Create and manage insurance sales records
- Calculate customer rewards using 4 different strategies
- Store data in MySQL database
- Provide API for the Vue 3 frontend

## Requirements

- .NET 8.0 SDK
- MySQL 8.0+

## Running the backend

```bash
# Install dependencies
dotnet restore

# Setup database connection in appsettings.Development.json

# Apply database migrations
dotnet ef database update

# Run
dotnet run
```

API runs at https://localhost:7174

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Get all sales |
| GET | `/api/sales/{id}` | Get sale by ID |
| POST | `/api/sales` | Create new sale |
| PUT | `/api/sales/{id}/price-satisfaction` | Update price & satisfaction |
| DELETE | `/api/sales/{id}` | Delete sale |
| GET | `/api/sales/calculatereward/{strategyType}` | Calculate rewards |

## Built with

- .NET 8.0 Web API
- MySQL database
- Entity Framework Core
- AutoMapper

## Design Patterns

- Strategy Pattern (4 reward calculation strategies)
- Repository Pattern (data access)
- Factory Pattern (strategy creation)
- Adapter Pattern (third-party integration)
