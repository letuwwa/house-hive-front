# House Hive Frontend

The House Hive frontend is a React application built with Vite. It uses Redux Toolkit for application state, React Router for navigation, Axios for API requests, and Lucide for icons.

## Requirements

- Node.js 18 or newer
- npm
- A running House Hive API

## Install

Install project dependencies:

```bash
npm install
```

If Lucide has not already been added to the project:

```bash
npm install lucide-react
```

## Environment variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Vite exposes only environment variables beginning with `VITE_` to browser code. Do not put secrets in this file.

## Run locally

```bash
npm run dev
```

Open the address printed by Vite, normally `http://localhost:5173`.

## API client

Set Axios’s base URL from the environment variable:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
```

Since the base URL already includes `/api/v1`, API functions must not repeat it:

```js
api.get('/auth/me')
api.post('/auth/login', credentials)
```

## Icons

Import icons from `lucide-react`:

```jsx
import { Home, Users } from 'lucide-react'

<Home size={20} />
<Users aria-label="Members" />
```

## Scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build locally
```

## Notes

- Use React Router’s `<Link>` or `navigate()` for internal navigation.
- Keep `.env` out of version control; commit a `.env.example` containing only non-secret placeholder values.
