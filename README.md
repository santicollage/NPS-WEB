# NPS Diesel E-commerce

Frontend application for NPS Diesel e-commerce platform built with React, Vite, and modern web technologies.

## Tech Stack

- **Framework**: React 18.3.1 with Vite 7.1.7
- **State Management**: Redux Toolkit 2.9.2
- **Routing**: React Router DOM 7.9.5
- **Styling**: SASS 1.93.2 + Tailwind CSS
- **Animations**: Framer Motion 11.0.23
- **Icons**: Lucide React 0.561.0
- **HTTP Client**: Axios 1.13.1
- **Authentication**: Google OAuth (@react-oauth/google)
- **Maps**: Google Maps (@vis.gl/react-google-maps)
- **Charts**: Recharts 3.6.0
- **SEO**: React Helmet Async 2.0.5

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd NPS-ECOMMERCE
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
VITE_API_URL=your_api_url
VITE_API_GOOGLE_MAPS_KEY=your_google_maps_api_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_CLOUDFRONT_URL=your_cloudfront_url
```

## Environment Variables

| Variable                   | Description                   | Required |
| -------------------------- | ----------------------------- | -------- |
| `VITE_API_URL`             | Backend API base URL          | Yes      |
| `VITE_API_GOOGLE_MAPS_KEY` | Google Maps API key           | Yes      |
| `VITE_GOOGLE_CLIENT_ID`    | Google OAuth client ID        | Yes      |
| `VITE_CLOUDFRONT_URL`      | AWS CloudFront URL for assets | Yes      |

## Available Scripts

### Development

```bash
npm run dev
```

Starts the development server at `http://localhost:5173`

### Build

```bash
npm run build
```

Creates production build in `dist/` folder with:

- Console and debugger statements removed
- CSS code splitting enabled
- Optimized bundle size

### Preview

```bash
npm run preview
```

Preview production build locally

### Lint

```bash
npm run lint
```

Run ESLint to check code quality

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── AdminOrdersFilters/
│   ├── AdminOrdersList/
│   ├── Background/
│   ├── Benefits/
│   ├── Cart/
│   ├── CategoryFormModal/
│   ├── Filters/
│   ├── Footer/
│   ├── LoadingScreen/
│   ├── Navbar/
│   ├── PaymentModal/
│   ├── ProductCard/
│   ├── ProductsList/
│   ├── ProtectedRoute/
│   ├── PublicRoute/
│   ├── SEO/
│   └── ...
├── pages/             # Page components
│   ├── Home/
│   ├── About/
│   ├── Products/
│   ├── ProductDetail/
│   ├── Checkout/
│   ├── Login/
│   ├── Register/
│   ├── Profile/
│   ├── AdminDashboard/
│   ├── AdminProducts/
│   ├── AdminOrders/
│   ├── AdminStats/
│   └── ...
├── store/             # Redux store configuration
│   ├── slices/
│   │   ├── cartSlice.js
│   │   ├── productSlice.js
│   │   ├── orderSlice.js
│   │   ├── userSlice.js
│   │   ├── categorySlice.js
│   │   ├── statsSlice.js
│   │   ├── stockSlice.js
│   │   ├── paymentSlice.js
│   │   └── loadingSlice.js
│   ├── api.js         # API configuration
│   ├── index.js       # Store exports
│   └── store.jsx      # Store setup
├── assets/            # Static assets (images, fonts, etc.)
├── data/              # Static data files
├── hooks/             # Custom React hooks
├── services/          # API service layer
├── styles/            # Global styles
├── App.jsx            # Main app component
├── AppRoutes.jsx      # Route configuration
└── main.jsx           # Application entry point
```

## Features

### Public Features

- Product catalog with filtering and search
- Product detail pages (modal and full page)
- Shopping cart management
- Checkout process
- About page with company information
- Responsive design with dark mode

### Authentication

- User registration and login
- Google OAuth integration
- Password reset functionality
- Protected routes
- Role-based access control (User/Admin)

### User Features

- User profile management
- Order history
- Password change
- Address management

### Admin Features

- Dashboard with analytics
- Product management (CRUD operations)
- Order management and tracking
- Statistics and reports (Recharts integration)
- User management
- Category management
- Stock control
- Real-time order status updates

## Routing

### Public Routes

- `/` - Home page
- `/about` - About page
- `/products` - Products catalog
- `/products/:id` - Product detail
- `/checkout` - Checkout page

### Auth Routes (Public only)

- `/login` - User login
- `/register` - User registration
- `/reset-password` - Password reset

### Protected Routes (Authenticated users)

- `/profile` - User profile

### Admin Routes (Admin role required)

- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/products/:id` - Product detail/edit
- `/admin/orders` - Order management
- `/admin/orders/:id` - Order detail
- `/admin/stats` - Statistics and analytics

### Special Routes

- `/unauthorized` - Unauthorized access page
- `*` - 404 Not found page

## State Management

The application uses Redux Toolkit with the following slices:

- **cartSlice**: Shopping cart state and operations
- **productSlice**: Product catalog and filters
- **orderSlice**: Order management
- **userSlice**: User authentication and profile
- **categorySlice**: Product categories
- **statsSlice**: Admin statistics
- **stockSlice**: Inventory management
- **paymentSlice**: Payment processing
- **loadingSlice**: Global loading states

## Code Splitting

The application implements:

- Lazy loading for all page components
- Automatic code splitting via Vite
- CSS code splitting enabled
- Optimized bundle chunks for better performance

## Deployment

### Netlify

The project is configured for Netlify deployment with `netlify.toml`:

```bash
npm run build
```

Configuration includes:

- Node version: 22.18.0
- Build command: `npm run build`
- Publish directory: `dist`
- Legacy peer deps flag enabled

### Environment Variables on Netlify

Make sure to configure the following environment variables in Netlify:

- `VITE_API_URL`
- `VITE_API_GOOGLE_MAPS_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_CLOUDFRONT_URL`

## Code Quality

### ESLint

The project uses ESLint with React-specific rules:

- React hooks rules
- React refresh plugin
- Modern ES6+ standards

### Prettier

Code formatting is enforced with Prettier (version 3.7.2)

## Browser Support

Modern browsers with ES6+ support:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Tree-shaking enabled
- Console/debugger statements removed in production
- CSS code splitting
- Lazy loading routes
- Image optimization via CloudFront CDN
- Optimized bundle size

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

Copyright (c) 2026 NPS Diesel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contact

NPS Diesel - 3208767159

Project Link: https://github.com/santicollage/NPS-WEB
