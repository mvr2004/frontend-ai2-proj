import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserManagement from './pages/listar_User.js';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <Router>
      <Navigation />
      <div className="container mt-5">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UserManagement />} />
          {/* Adicione outras rotas aqui, por exemplo, uma rota para o dashboard */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
