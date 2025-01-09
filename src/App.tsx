// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'

// Layouts
import AdminLayout from './components/layout/AdminLayout'

// Public pages
import LandingPage from './pages/LandingPage'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'

// Client pages
import Dashboard from './pages/client/Dashboard'
import SearchProviders from './pages/client/SearchProviders'


// Auth guard component
import ProtectedRoute from './components/auth/ProtectedRoute'

import ClientLayout from './components/layout/ClientLayout';
import { Toaster } from 'react-hot-toast'; // Add this import


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />

            </Route>

            {/* Client routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="search" element={<SearchProviders />} />

            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App