import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserManagement from './views/listar_User';
import Navigation from './components/Navigation';
import ReportsList from './views/listar_Reports';

const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/reportsPorResolver" element={<ReportsList resolvido={false} />} />
          <Route path="/reportsResolvidos" element={<ReportsList resolvido={true} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
