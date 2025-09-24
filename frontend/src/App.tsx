import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/authContext';
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import SessionExpiredModal from './components/auth/SessionExpiredModal';
import { Toaster } from './components/ui/toaster';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import { MessagingProvider } from './contexts/MessagingContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1 minutes
      retry: 3,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MessagingProvider>
            <ThemeProvider>
              <Router>
                <SessionExpiredModal />
                <AppRoutes />
                <Toaster />
              </Router>
            </ThemeProvider>
          </MessagingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
