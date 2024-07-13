// Arquivo: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserManagement from './views/listar_User';
import Navigation from './components/Navigation';
import ReportsList from './views/listar_Reports';
import VerReport from './views/ver_Report';
import EventManagement from './views/listar_Events';
import CenterManagement from './views/listar_Centros';
import CriarCentros from './views/criar_Centros';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <EventManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reportsPorResolver" 
            element={
              <ProtectedRoute>
                <ReportsList resolvido={false} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reportsResolvidos" 
            element={
              <ProtectedRoute>
                <ReportsList resolvido={true} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports/:id" 
            element={
              <ProtectedRoute>
                <VerReport />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/centers" 
            element={
              <ProtectedRoute>
                <CenterManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/createCenter" 
            element={
              <ProtectedRoute>
                <CriarCentros />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
