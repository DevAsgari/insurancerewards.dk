# Insurance Rewards - Frontend

Vue 3 + TypeScript frontend application for an insurance rewards system. Users can register insurance sales and calculate customer rewards using different strategies.

## 🚀 Features

- **Sales Registration**: Register new insurance sales with type, price, satisfaction rating, and date
- **Reward Calculation**: Calculate rewards using multiple strategies:
  - Customer Satisfaction (satisfaction × 10)
  - Sales Price (price × 5%)
  - Combined Strategy (price × 5% + satisfaction × 20)
  - Adjusted Strategy (third-party adapter pattern)
- **Sales Management**: View, edit, and delete registered sales
- **Responsive Design**: Mobile-first design with Tailwind CSS v4
- **Real-time Validation**: Form validation with immediate feedback
- **Toast Notifications**: User-friendly success/error messages

## 🛠️ Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Icons**: Phosphor Icons
- **Routing**: Vue Router 4
- **Testing**: Vitest + Vue Test Utils
- **Node**: ^20.19.0 or >=22.12.0

## 📁 Project Structure

```
src/
├── api/                      # API service layer
│   └── services/
│       └── salesApi.ts       # Backend communication
│
├── features/                 # Feature-based organization
│   ├── sales/                # Sales management
│   │   ├── components/       # SaleForm, EditSaleModal, SalesRewardsTable
│   │   ├── composables/      # useSalesManagement
│   │   ├── types/            # Sale types
│   │   └── constants/        # Sales constants
│   ├── rewards/              # Reward calculation
│   │   ├── components/       # RewardCalculator
│   │   ├── composables/      # useRewardCalculation
│   │   ├── types/            # Reward types
│   │   └── constants/        # Reward strategies
│   └── utils/                # Validation, formatting utilities
│
├── shared/                   # Shared components & composables
│   ├── components/           # EmptyState, Snackbar, ConfirmDialog
│   ├── composables/          # useSnackbar, useConfirm, useIconSizes
│   └── layout/               # Navbar
│
├── assets/                   # Styles, fonts, images
├── config/                   # App configuration
├── App.vue                   # Root component
├── main.ts                   # Entry point
└── router.ts                 # Route definitions
```

## 🏗️ Architecture

### Feature-Based Organization

Code is organized by **business domain** (features) rather than technical role:

- ✅ **Colocation**: Related code (components, types, tests) kept together
- ✅ **Clear Boundaries**: Each feature is self-contained
- ✅ **Barrel Exports**: Clean imports via `index.ts` files
- ✅ **Scalability**: Easy to add new features without affecting existing ones

### Design Patterns

- **Composables Pattern**: Reusable reactive logic (useSalesManagement, useRewardCalculation)
- **Service Layer**: Centralized API communication (salesApi)
- **Global State**: Shared state via composables (useSnackbar, useConfirm)

## 📦 Installation

```bash
npm install
```

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

Runs on `https://localhost:55992` (or next available port)

### Build for Production

```bash
npm run build
```

Type-checks and builds the production bundle.

Build only (skip type-check):
```bash
npm run build-only
```

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

Runs all tests in watch mode.

### Run Tests Once (CI mode)

```bash
npm test -- --run
```

### Test UI

```bash
npm run test:ui
```

Opens Vitest UI for interactive test running.

### Coverage Report

```bash
npm run test:coverage
```

### Test Coverage

**Total: 370 tests, all passing ✅**

- **API Layer**: 11 tests
- **Composables**: 20 tests
- **Components**: 35 tests
- **Utilities**: 49 tests
- **Views**: 9 tests
- **Shared Components**: 246 tests

## 🔍 Type Checking

```bash
npm run type-check
```

Runs `vue-tsc` to check TypeScript types.

## 🎨 Code Quality

### Linting

```bash
npm run lint
```

Runs ESLint with auto-fix enabled.

## 🔗 Integration with Backend

This frontend integrates with an ASP.NET Core backend:

- API calls are proxied via Vite to `https://localhost:7174` (or `ASPNETCORE_HTTPS_PORT`)
- Uses ASP.NET dev certificates for HTTPS
- Backend serves this frontend as SPA fallback

## 💻 Recommended IDE Setup

- **VS Code** + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension
- Disable Vetur if installed

## 🌐 Browser DevTools

**Chromium (Chrome, Edge, Brave):**
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Turn on Custom Object Formatter](http://bit.ly/object-formatters)

**Firefox:**
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Turn on Custom Object Formatter](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## 🎯 Key Conventions

- **Options API** with `setup()` function (NOT `<script setup>`)
- **TypeScript** for type safety
- **Barrel exports** for clean imports (`@/features/sales/components`)
- **Path alias**: `@` maps to `src/`
- **Icon library**: Phosphor Icons only (no inline SVG)
- **CSS**: Tailwind CSS v4 with custom design tokens

## 📝 License

Private project
