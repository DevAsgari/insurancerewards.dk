# Insurance Rewards System

A full-stack application for managing insurance sales and calculating customer rewards using different reward calculation strategies.

![.NET 8.0](https://img.shields.io/badge/.NET-8.0-512BD4?logo=.net)
![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)

## 🎯 Features

- **Sales Management**: Create, read, update, and delete insurance sales records
- **Reward Calculation**: Calculate customer rewards using multiple strategies:
  - Customer Satisfaction (satisfaction × 10)
  - Sales Price (price × 5%)
  - Combined (price × 5% + satisfaction × 20)
  - Adjusted (third-party adapter strategy)
- **Real-time Updates**: Responsive UI with instant feedback
- **Type-Safe**: Full TypeScript implementation with comprehensive type safety
- **Well-Tested**: 76 backend tests + 370 frontend tests, all passing
- **Production-Ready**: Health checks, CORS, security headers, and monitoring

## 🏗️ Architecture

### Backend (ASP.NET Core)
- **Design Patterns**: Strategy, Factory, Repository, Adapter
- **Clean Code**: SOLID principles, separation of concerns
- **Database**: MySQL with Entity Framework Core
- **API**: RESTful endpoints with Swagger documentation
- **Security**: CORS, HSTS, global exception handling

### Frontend (Vue 3 + TypeScript)
- **Architecture**: Feature-based organization with colocation
- **State Management**: Composables with reactive state
- **Type Safety**: Full TypeScript coverage
- **Testing**: Vitest with Vue Test Utils (370 tests)
- **UI**: Responsive design with Phosphor Icons

## 🛠️ Tech Stack

### Backend
- .NET 8.0 (LTS)
- Entity Framework Core 8.0.13
- Pomelo.EntityFrameworkCore.MySql 8.0.3
- AutoMapper 12.0.1
- Swashbuckle (Swagger/OpenAPI)
- xUnit + Moq (testing)

### Frontend
- Vue 3 (Composition API)
- TypeScript 5.x
- Vite
- Vue Router
- Vitest (testing)
- Phosphor Icons

### Database
- MySQL 8.0+

## 📋 Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (^20.19.0 or >=22.12.0)
- MySQL 8.0+
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Rewards
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE rewards_db;
```

Update connection string in `Rewards.Server/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=rewards_db;User=root;Password=your_password;Port=3306;"
  }
}
```

### 3. Backend Setup

```bash
cd Rewards.Server

# Restore NuGet packages
dotnet restore

# Apply database migrations
dotnet ef database update

# Build the project
dotnet build
```

### 4. Frontend Setup

```bash
cd rewards.client

# Install dependencies
npm install
```

## 🏃 Running the Application

### Full Stack (Backend + Frontend)

The easiest way to run both:

```bash
cd Rewards.Server
dotnet run
```

This starts:
- Backend API on **https://localhost:7174**
- Frontend (via SPA proxy) on **https://localhost:55992**

Open your browser to **https://localhost:55992**

### Backend Only

```bash
cd Rewards.Server
dotnet run
```

API available at: **https://localhost:7174**
Swagger UI: **https://localhost:7174/swagger**

### Frontend Only

```bash
cd rewards.client
npm run dev
```

Frontend available at: **https://localhost:55992**

## 🧪 Testing

### Backend Tests

```bash
cd Rewards.Server.Tests
dotnet test

# With detailed output
dotnet test --logger "console;verbosity=detailed"
```

**76 tests, all passing** ✅

### Frontend Tests

```bash
cd rewards.client
npm test

# Run once (CI mode)
npm test -- --run

# With coverage
npm run test:coverage
```

**370 tests, all passing** ✅

### Type Checking

```bash
cd rewards.client
npm run type-check
```

## 📁 Project Structure

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

## 📡 API Endpoints

### Sales

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Get all sales |
| GET | `/api/sales/{id}` | Get sale by ID |
| POST | `/api/sales` | Create new sale |
| PUT | `/api/sales/{id}/price-satisfaction` | Update price & satisfaction |
| DELETE | `/api/sales/{id}` | Delete sale |
| GET | `/api/sales/calculatereward/{strategyType}` | Calculate rewards (0-3) |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

### Strategy Types

- `0` - Customer Satisfaction (satisfaction × 10)
- `1` - Sales Price (price × 5%)
- `2` - Combined (price × 5% + satisfaction × 20)
- `3` - Adjusted (third-party adapter)

## 🏗️ Design Patterns

### Strategy Pattern
Multiple reward calculation strategies that can be swapped at runtime:
- `IRewardStrategy` interface
- `CustomerSatisfactionRewardStrategy`
- `SalesPriceRewardStrategy`
- `CombinedRewardStrategy`
- `AdapterRewardStrategy` (wraps third-party library)

### Factory Pattern
`RewardStrategyFactory` creates strategy instances using Dictionary for O(1) lookup.

### Repository Pattern
`ISaleRepository` abstracts data access, making the code testable and maintainable.

### Adapter Pattern
`AdapterRewardStrategy` adapts external `StrategyFromAnotherCompany` to `IRewardStrategy` interface.

## 🔒 Security Features

- ✅ Database passwords stored in environment variables
- ✅ CORS configuration (development + production)
- ✅ HTTPS enforcement with HSTS
- ✅ Global exception handling
- ✅ Input validation
- ✅ Swagger disabled in production
- ✅ Health checks for monitoring

## 🚢 Deployment

### Environment Variables

For production deployment, set these environment variables:

```bash
ConnectionStrings__DefaultConnection="Server=...;Database=...;User=...;Password=...;Port=3306;"
Cors__AllowedOrigins__0="https://your-frontend-domain.com"
ASPNETCORE_ENVIRONMENT=Production
```

### Database Migrations

Apply database migrations:

```bash
dotnet ef database update
```

### Build and Publish

Build the application for production:

```bash
dotnet publish -c Release -o ./publish
```

### Health Check

Verify the deployment:

```bash
curl https://your-api-domain.com/health
```

Expected response: `Healthy`

## 📊 Test Coverage

### Backend (xUnit + Moq)
- **76 tests** covering:
  - All reward strategies
  - Service layer with mocking
  - Repository CRUD operations
  - Factory pattern
  - Edge cases and error handling

### Frontend (Vitest + Vue Test Utils)
- **370 tests** covering:
  - API services (11 tests)
  - Composables (20 tests)
  - Components (35 tests)
  - Utilities (49 tests)
  - Views (9 tests)
  - Shared components (246 tests)

## 🛣️ Roadmap

- [ ] Add rate limiting to API endpoints
- [ ] Implement authentication/authorization
- [ ] Add export functionality (CSV, PDF)
- [ ] Create admin dashboard
- [ ] Add real-time notifications
- [ ] Performance monitoring (Application Insights)
- [ ] Caching layer (Redis)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

- **Maria** - Initial work

## 🙏 Acknowledgments

- Built with [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet)
- Frontend powered by [Vue.js](https://vuejs.org/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Database: [MySQL](https://www.mysql.com/)
