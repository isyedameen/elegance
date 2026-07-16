# Elegance Frontend

## Project Overview
Elegance is an e-commerce web application frontend designed to provide a seamless shopping experience for users and an integrated management interface for administrators. It handles product browsing, cart management, checkout, user authentication, and includes a full-featured admin panel for managing categories, products, orders, and promotional banners.

## Key Features
- **User Authentication**: Login, Registration, and User Profiles.
- **Product Discovery**: Browse categories, view product details, and search/filter.
- **Shopping Experience**: Add to cart, wishlist, and secure checkout process.
- **Order Management**: Track past orders and view order success confirmations.
- **Admin Panel**: Secure dashboard for administrators to manage:
  - Categories (Add, Edit, Manage)
  - Products (Add, Edit, Manage)
  - Orders (Manage)
  - Promotional Banners (Manage)
- **Responsive Design**: Modern UI built with Tailwind CSS.
- **Animations**: Smooth transitions and micro-animations using Framer Motion.
- **Notifications**: Interactive user feedback via React Hot Toast.

## Technology Stack
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router DOM 7](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Typography**: `@fontsource` (Inter, Outfit, Plus Jakarta Sans)

## Project Structure
```text
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/                # API configuration and base URLs
│   ├── components/         # Reusable UI components (Navbar, Banner, etc.)
│   ├── pages/              # Application views/routes
│   │   ├── admin/          # Admin dashboard views
│   │   └── ...             # Public and user-specific views
│   ├── Style.css           # Global CSS styles
│   └── main.jsx            # Application entry point & Routing
├── .env                    # Environment variables
├── eslint.config.js        # ESLint configuration
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite configuration
```

## Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- npm (comes with Node.js)

## Installation
1. Clone the repository: *(Requires User Input)*
2. Navigate to the project directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the root of the project with the following structure:
```env
VITE_API_BASE_URL=https://elegance-api.syedameen.online
```
*(Modify the base URL as needed for your backend API)*

## Running the Project
To start the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Available Scripts
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality and style issues.

## API Integration
The application communicates with a backend API. The base URL is configured in `src/api/index.js` using the `VITE_API_BASE_URL` environment variable. 

## Authentication
Authentication states and user roles (e.g., `"admin"`) are managed and persisted in `localStorage`. The application includes role-based route protection to ensure only authorized administrators can access the `/admin/*` endpoints.

## Screenshots or Demo
*Requires User Input*

## Contributing
*Requires User Input*

## License
*Requires User Input*

## Author
*Requires User Input*
