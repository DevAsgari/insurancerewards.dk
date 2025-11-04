# Insurance Rewards - Frontend

Vue 3 + TypeScript frontend for managing insurance sales and calculating customer rewards.

## What it does

- Register new insurance sales
- Calculate rewards using 4 different strategies
- View, edit, and delete sales
- Responsive design for mobile and desktop
- Real-time form validation

## Built with

- Vue 3 with TypeScript
- Vite build tool
- Tailwind CSS
- Vitest for testing

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

## Running the frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at https://localhost:55992

## Testing

```bash
# Run all tests
npm test

# Test with coverage
npm run test:coverage
```

370 tests covering components, composables, and utilities.
