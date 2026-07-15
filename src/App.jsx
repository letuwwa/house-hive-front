import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useEffect } from "react";
import { useDispatch } from "react-redux"; //for redux
import { getMe } from "./features/auth/authSlice";

import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import FindHouse from './pages/FindHouse.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Register from './pages/Register.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {index: true, element: <Navigate to="/login" replace />},
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'FindHouse',
        element: (
          <ProtectedRoute>
            <FindHouse />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App
