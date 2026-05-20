import { BrowserRouter as Router , Routes, Route} from 'react-router-dom';
import Reports from './components/pages/reports/Reports';
import Home from './components/pages/Home/Home';
import Sign from './components/pages/sign-in/sign-in';
import Users from './components/pages/Users/Users';
import Statistics from './components/pages/stats/statistics';
import Applications from './components/pages/applications/applications';
import { AuthProvider } from './AuthContext';
import { Navbar } from './components/navbar/Navbar';
import ProtectedRoute from './ProtectedRoute';
import { useState } from 'react';
//import './App.css';

function App() {
  const [isAuthentificated,setIsAuthentificated]=useState(false);

  return (
    <AuthProvider>
     
    <Router>
      <ProtectedRoute >
        <Navbar/>
      </ProtectedRoute>
      <Routes>
        <Route path="/login" element={<Sign />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/stats" 
          element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App; 