# Architecture Overview

## High-Level System

- **Frontend**: Next.js 16 (App Router) + React 19, TypeScript, Tailwind CSS 4
  - App directory structure under `src/app`
  - Separate pages/flows for gemstones, diamonds, melee, auctions, etc.
  - Uses `next/navigation` for routing and search params
  - Uses `lucide-react` for icons and several shared UI components
  - Integrates with backend via service modules (for example `gemstoneService`)
- **Backend**: NestJS API (`be-ohana`)
  - Modularized by domain under `src/v1` (gem-stone, diamond, melee-diamond, jewellery, product, auth, etc.)
  - Uses Prisma for database access
  - Uses DTOs, guards, decorators (`AuthGuard`, `User`, `QueryOptions`, etc.)
  - JWT-based authentication with role/seller-type checks

## Roles and Core Concepts

- **Buyer (end user)**
  - Browses products (diamonds, gemstones, melee gemstones, jewellery, etc.)
  - Uses filters (shape, color, clarity, price, dimensions, certification, origin, etc.)
  - Manages wishlist
  - Adds items to cart and proceeds to checkout (not fully covered by the snippets but implied)

- **Seller**
  - Identified through `IAppUser` with an attached `seller` object and `sellerType`
  - Can create, update, and delete their inventory:
    - `GemStoneService` for gemstones
    - Other services for diamonds, melee diamonds, jewellery
  - Restricted by guards and helper functions, for example `checkGemsStoneSellerType`

- **Products**
  - Multiple product types: diamond, gemstone, melee diamond, jewellery
  - Each product type has:
    - Create/Update DTOs
    - Service methods for CRUD and listing
    - Controller endpoints for REST API exposure
  - Some shared infrastructure for bulk operations (e.g., upload product excel DTOs)

## Buyer Flows (Frontend)

### Gemstone Listing (Single Gemstones)

- Route: `/gemstones/products`
- Page: `src/app/gemstones/products/page.tsx`
- Responsibilities:
  - Read query parameters from URL (category, filters)
  - Manage local state:
    - `gemstones` array
    - `loading`, `error`
    - `viewMode` (`grid` or `list`)
    - `filters` (`GemstoneFilterValues`)
    - `pagination` (`page`, `limit`, `total`, `totalPages`)
  - Fetch data via `gemstoneService.getAllGemstones`
  - Render:
    - Search bar
    - Filter drawer for mobile, sidebar-like filters for desktop
    - Result grid/list
    - Pagination controls

### Melee Gemstone Listing

- Route: `/gemstones/melee`
- Page: `src/app/gemstones/melee/page.tsx`
- Responsibilities are similar to single gemstones, but with melee-specific logic:
  - Quantity filter in query (`quantity: { gt: 1 }`)
  - Tighter ranges for carat/dimensions (melee stones are smaller)
  - Adjusted copy (`All Melee Gemstones` etc.)
  - Special UI for parcels (e.g. `Parcel` badge when `quantity > 1`)
  - Listing supports grid and list view via `GemstoneCard`
  - Uses the same core filtering concepts as the main gemstones page:
    - `GemstoneFilterValues`
    - Price, carat, dimensions, shape, color, clarity, certification, origin, treatment, etc.

### Wishlist / User Navigation

- Shared components:
  - `NavigationUser` for top navigation
  - `WishlistButton` used in product cards to toggle wishlist status
- Flow:
  - User navigates as an authenticated buyer
  - Items can be added to favorites with `WishlistButton`
  - Navigation and footer are reused across product listing pages

## Seller Flows (Backend)

### Gemstone Management

- Module: `be-ohana/src/v1/gem-stone`
- Key files:
  - `gem-stone.service.ts` (`GemStoneService`)
  - `gem-stone.controller.ts` (`GemStoneController`)
  - DTOs under `dto/` (create, update, get, delete)
- Core operations:
  - `createGemStone`:
    - Validates seller via `checkGemsStoneSellerType`
    - Handles image uploads via `AwsService` and S3 bucket
    - Creates a `gemstone` record using Prisma
  - `getGemStoneById`:
    - Fetches gemstone including seller info and auction data
  - `updateGemStoneById`:
    - Validates ownership and seller type
    - Handles optional image replacements
    - Updates record with cleaned DTO data

### Bulk Operations

- Module: `be-ohana/src/v1/product`
- Example DTO: `upload-product-excel.dto.ts`
  - Supports bulk creation for gems, diamonds, melee diamonds, jewellery
  - Uses `class-validator` and `class-transformer` to validate rows
- Service: `ProductsService`
  - Maps product types to Prisma models
  - Provides import/upload flows for admins/sellers

## Authentication and Authorization

- Uses JWT, configured via `JwtModule` with `ConfigService`
- Guard-based protection:
  - `AuthGuard` for authenticated endpoints
  - Seller-specific checks via helpers like `checkGemsStoneSellerType`
- `IAppUser` injected with a custom `@User()` decorator to controllers:
  - Provides `user.seller`, `sellerType`, and other identity details
  - Used to enforce ownership on updates/deletes

## Folder / Flow Level Improvements

### 1. Frontend App Structure

- **Problem**: Pages like `gemstones/products` and `gemstones/melee` share a lot of logic (filters, pagination, view mode, layout) but duplicate code.
- **Improvement**:
  - Extract shared listing logic into reusable building blocks:
    - `useGemstoneListing` hook that encapsulates:
      - `gemstones`, `loading`, `error`, `filters`, `pagination`
      - `fetchGemstones`, `handleSearch`, `handlePageChange`, `handleSortChange`, `handleFiltersChange`
    - Shared components:
      - `GemstoneResultsHeader`
      - `GemstoneFiltersDrawer`
      - `GemstoneTypeFilterBar`
      - `PaginationControls`
  - The melee and single gemstone pages would then become thin wrappers that:
    - Configure initial filter ranges
    - Add melee-specific UI (parcel badges, labels)
    - Pass different query builders into the shared hook if needed

### 2. Consistent Layout and Theming

- **Problem**: Many inline `style={{ ... }}` with repeated `var(--background)`, `var(--border)` appear across cards and layouts.
- **Improvement**:
  - Move commonly used combinations to Tailwind layer utilities or CSS classes:
    - For example, a `card` class for background, border, and text colors
    - A `card-header`, `card-body`, `card-footer` pattern
  - This reduces duplication and keeps JSX cleaner.

### 3. Filter State and URL Synchronization

- **Problem**:
  - URL search params and local `filters` state are kept in sync manually on every page.
  - Logic is similar but not fully shared between gemstones and melee gemstones.
- **Improvement**:
  - Introduce a shared utility/hook for mapping between:
    - `GemstoneFilterValues` ↔ URLSearchParams
  - For example:
    - `parseFiltersFromSearchParams(searchParams): GemstoneFilterValues`
    - `buildSearchParamsFromFilters(filters): URLSearchParams`
  - This would:
    - Ensure consistent interpretation of filters across pages
    - Make it easier to add new filters without duplicating logic

### 4. Domain-Focused Modules

- **Problem**:
  - Some domain logic is spread across services or controllers and duplicated for each product type.
- **Improvement**:
  - Introduce a clearer domain layer for shared operations:
    - Shared pricing logic (price per carat, lot price labels)
    - Shared attribute formatting (e.g. color/clarity labels)
  - On the backend, keep each domain under a consistent path:
    - `src/v1/gem-stone`
    - `src/v1/diamond`
    - `src/v1/melee-diamond`
    - `src/v1/jewellery`
  - Add a common base service/utilities for:
    - Pagination
    - Filtering
    - Ownership checks

### 5. Buyer vs Seller App Surfaces

- **Problem**:
  - Buyer and seller flows share some backend infrastructure but may not be clearly separated in UI or routing.
- **Improvement**:
  - In the frontend, clearly separate:
    - Buyer-facing routes (marketplace, listings, product detail, cart, wishlist)
    - Seller-facing routes (inventory, create/update product, bulk upload, dashboard)
  - In the backend:
    - Keep seller-only endpoints under guarded controllers
    - Use DTOs specialized for seller operations vs buyer views
  - Optionally introduce a BFF-style layer or internal endpoints for admin/seller tooling.

## Code Level Improvements

### 1. Stronger Typing and Reuse

- Use shared TypeScript types/interfaces across frontend and backend when possible (or generate types from the backend DTOs/Prisma schema).
- Ensure service methods (`gemstoneService.getAllGemstones`) have strongly typed responses instead of `any` or implicit `data.data`.
- For filter values and query params:
  - Define a central `GemstoneQueryParams` type and reuse it in:
    - frontend query builders
    - backend controllers/services for validation

### 2. Error Handling and User Feedback

- Standardize error handling for API calls:
  - Wrap calls in a small helper that:
    - Logs errors consistently
    - Normalizes error messages for the UI
  - Example pattern:
    - `safeApiCall(() => gemstoneService.getAllGemstones(queryParams))`
- Show more specific messages in the UI when possible:
  - Distinguish between network errors, validation errors, and server errors.

### 3. Extract Shared UI Components

- Product card layouts (for grid and list) are complex and reused across diamonds/gemstones/melee.
- Improvement:
  - Create shared components:
    - `ProductCardGrid`
    - `ProductCardList`
  - Make them configurable via props:
    - `showParcelBadge`
    - `showPricePerCarat`
    - `productType`
  - Use these components in:
    - `gemstones/products/page.tsx`
    - `gemstones/melee/page.tsx`
    - Diamond and other product pages.

### 4. Avoid Direct DOM Manipulation Where Possible

- Some filter sections use `document.querySelectorAll` to filter options based on search input.
- Improvement:
  - Move this to React state instead:
    - Maintain a `searchTerm` per filter section.
    - Filter options in render based on that `searchTerm`.
  - This keeps the code more idiomatic and avoids mixing DOM queries with React rendering.

### 5. API Layer Abstraction

- Currently, the frontend calls services like `gemstoneService` directly with query objects.
- Improvement:
  - Introduce a small API client layer with:
    - Clear methods per use case (e.g. `listMeleeGemstones`, `listGemstones`, `getGemstoneDetails`)
    - Strong typing for parameters and responses
  - This makes it easier to:
    - Change backend endpoints without touching UI components
    - Add caching or logging at a single layer.

### 6. Testing Improvements

- Add unit/integration tests around:
  - Filter mapping (URL ↔ filters)
  - Pagination logic
  - Seller permission checks on the backend
- For the frontend:
  - Use React Testing Library to verify:
    - Filters update results correctly
    - Pagination works for melee and single gemstones

---

This file is a starting point. As more parts of the system are implemented (auctions, orders, payments, messaging), similar patterns can be applied:
- Keep domains modularized.
- Share logic at the right abstraction layer.
- Maintain clear separation between buyer, seller, and admin responsibilities.

