import React, { useState } from 'react';
import { Card, Button, Form, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CriarCentros = () => {
  const [centro, setCentro] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateCentro = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    try {
      const response = await axios.post('https://backend-ai2-proj.onrender.com/centro/create', { centro, adminPassword });
      setSuccessMessage(response.data.message + "! A ser redirecionado...");  
      setTimeout(() => navigate('/centers'), 2000); // Redirect to the list page after 2 seconds
    } catch (error) {
      console.error('Erro ao criar o centro:', error);
      setErrorMessage(error.response?.data?.message || 'Erro ao criar o centro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Criar um novo Centro</h1>
      <Card>
        <Card.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleCreateCentro}>
            <Form.Group controlId="formCentro">
              <Form.Label>Nome do Centro</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduza o nome do centro"
                value={centro}
                onChange={(e) => setCentro(e.target.value)} //Guarda o nome do Centro
                required
              />
            </Form.Group>
            <Form.Group controlId="formAdminPassword">
              <Form.Label>Palavra-Passe do Admin</Form.Label>
              <Form.Control
                type="password"
                placeholder="Introduza a password do administrador"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)} //Guarda a Palavra-Passe
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Centro'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
    
  );
};

export default CriarCentros;
