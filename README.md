# Insurance Rewards System

A web application for managing insurance sales and calculating customer rewards.

Improved version of my MVC-based Reward System, rebuilt with modern technologies.

## What it does

- Create and manage insurance sales records
- Calculate customer rewards using different strategies
- Real-time updates in the browser
- View sales history and reward calculations

## Reward Calculation Strategies

The system offers 4 different ways to calculate rewards:
1. **Customer Satisfaction** - Based on customer satisfaction score
2. **Sales Price** - Based on the sale amount
3. **Combined** - Mix of both price and satisfaction
4. **Adjusted** - Uses a third-party calculation method

## Built with

**Backend**
- .NET 8.0 Web API
- MySQL database
- Entity Framework Core

**Frontend**
- Vue 3 with TypeScript
- Responsive design

## Project Structure

```
Rewards/
├── Rewards.Server/              # ASP.NET Core Web API
│   ├── Configuration/           # AutoMapper profiles
│   ├── Controllers/             # API endpoints
│   ├── Data/                    # DbContext
│   ├── DTOs/                    # Data Transfer Objects
│   ├── Entities/                # Domain models
│   ├── Middleware/              # Global exception handling
│   ├── Migrations/              # EF Core migrations
│   ├── Repositories/            # Data access layer
│   ├── Services/                # Business logic
│   ├── Strategies/              # Reward calculation strategies
│   └── Validation/              # Validation logic & constants
│
├── Rewards.Server.Tests/        # Backend unit tests (76 tests)
│   ├── Strategies/              # Strategy tests
│   ├── Services/                # Service layer tests
│   └── Repositories/            # Repository tests
│
├── rewards.client/              # Vue 3 + TypeScript SPA
│   └── src/
│       ├── api/                 # API service layer
│       ├── features/            # Feature-based modules
│       │   ├── sales/           # Sales management
│       │   └── rewards/         # Reward calculation
│       ├── shared/              # Shared components & composables
│       ├── assets/              # Fonts, icons, images, styles
│       └── views/               # Page components
│
├── Tredjepart/                  # Third-party library simulation
│
└── README.md                    # This file
```

## API Endpoints

### Sales

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Get all sales |
| GET | `/api/sales/{id}` | Get sale by ID |
| POST | `/api/sales` | Create new sale |
| PUT | `/api/sales/{id}/price-satisfaction` | Update price & satisfaction |
| DELETE | `/api/sales/{id}` | Delete sale |
| GET | `/api/sales/calculatereward/{strategyType}` | Calculate rewards (0-3) |

## Running the project

### Requirements
- .NET 8.0 SDK
- Node.js (v20+)
- MySQL 8.0+

### Quick Start

1. Create a MySQL database called `rewards_db`

2. Update connection string in `Rewards.Server/appsettings.Development.json`

3. Start the backend:
```bash
cd Rewards.Server
dotnet restore
dotnet ef database update
dotnet run
```

4. Start the frontend:
```bash
cd rewards.client
npm install
npm run dev
```

5. Open https://localhost:55992 in your browser

## Testing

**Backend:** 76 tests
```bash
cd Rewards.Server.Tests
dotnet test
```

**Frontend:** 370 tests
```bash
cd rewards.client
npm test
```

## View online

Visit [insurancerewards.dk](https://insurancerewards.dk)

## Project Background

This project demonstrates:
- Design patterns (Strategy, Factory, Repository, Adapter)
- Clean architecture
- Full-stack development
- Test-driven development
