import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CenterManagement = () => {
  const [centros, setCentros] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCentro, setCurrentCentro] = useState({});
  const [newCentroName, setNewCentroName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCentros();
  }, []);

  const fetchCentros = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://backend-ai2-proj.onrender.com/centro/list');
      setCentros(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar centros:', error);
      setErrorMessage('Erro ao carregar a lista de centros');
      setIsLoading(false);
    }
  };

  const handleEditModalOpen = (centro) => {
    setCurrentCentro(centro);
    setNewCentroName(centro.centro);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setCurrentCentro({});
    setNewCentroName('');
    setShowEditModal(false);
  };

  const handleEditCentro = async () => {
    try {
      const { id } = currentCentro;
      const updatedCentro = { ...currentCentro, centro: newCentroName };
      await axios.put(`https://backend-ai2-proj.onrender.com/centro/update/${id}`, updatedCentro);
      fetchCentros();
      setShowEditModal(false);
    } catch (error) {
      console.error('Erro ao editar centro:', error);
      // Tratar erro, se necessário
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-ai2-proj.onrender.com/centro/delete/${id}`);
      // Atualiza a lista de centros após a exclusão
      const updatedCentros = centros.filter((centro) => centro.id !== id);
      setCentros(updatedCentros);
    } catch (error) {
      console.error('Erro ao deletar o centro:', error);
      // Trate o erro, se necessário
    }
  };

  const renderCentrosTable = () => {
    return (
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Centro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {centros.map((centro) => (
            <tr key={centro.id}>
              <td>{centro.id}</td>
              <td>{centro.centro}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditModalOpen(centro)}>
                  Editar
                </Button>
                <Button variant="danger" className="ms-2" onClick={() => handleDelete(centro.id)}>
                    Apagar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="container mt-5">
      <h1>Centros</h1>
      <Button variant="primary" className="mb-3" onClick={() => navigate('/createCenter')}>
        Adicionar Novo Centro
      </Button>
      <Card>
        <Card.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            renderCentrosTable()
          )}
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Centro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCentroName">
              <Form.Label>Novo Nome do Centro</Form.Label>
              <Form.Control
                type="text"
                value={newCentroName}
                onChange={(e) => setNewCentroName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditCentro}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CenterManagement;
