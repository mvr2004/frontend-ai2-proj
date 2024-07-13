import React, { useState, useEffect } from 'react';
import { Table, Spinner, Button, Pagination, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  const [idCentroAdmin, setIdCentro] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});
  const [newEventData, setNewEventData] = useState({
    nome: '',
    data: '',
    localizacao: '',
    descricao: '',
    ativo: false,
  });

  useEffect(() => {
    const obterIDCentro = async () => {
      const storedIdCentro = localStorage.getItem('idCentro');
      if (storedIdCentro) {
        setIdCentro(storedIdCentro);
      } else {
        setError('ID do centro não encontrado');
        setLoading(false);
      }
    };
    obterIDCentro();
  }, []);

  useEffect(() => {
    if (idCentroAdmin) {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`https://backend-ai2-proj.onrender.com/eventos/listByCentro/${idCentroAdmin}`);
          setEvents(response.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      fetchEvents();
    }
  }, [idCentroAdmin]);

  const handleEditModalOpen = (event) => {
    setCurrentEvent(event);
    setNewEventData({
      nome: event.nome,
      data: new Date(event.data).toISOString().slice(0, 10),
      localizacao: event.localizacao,
      descricao: event.descricao,
      ativo: event.ativo,
    });
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setCurrentEvent({});
    setNewEventData({
      nome: '',
      data: '',
      localizacao: '',
      descricao: '',
      ativo: false,
    });
    setShowEditModal(false);
  };

  const handleEditEvent = async () => {
    try {
      const updatedEvent = { ...currentEvent, ...newEventData };
      await axios.put(`https://backend-ai2-proj.onrender.com/eventos/update/${currentEvent.id}`, updatedEvent);
      const updatedEvents = events.map((event) => (event.id === currentEvent.id ? updatedEvent : event));
      setEvents(updatedEvents);
      setShowEditModal(false);
    } catch (error) {
      console.error('Erro ao editar evento:', error);
      setError('Erro ao editar evento');
    }
  };

  const handleDeleteModalOpen = (event) => {
    setCurrentEvent(event);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setCurrentEvent({});
    setShowDeleteModal(false);
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`https://backend-ai2-proj.onrender.com/eventos/delete/${currentEvent.id}`);
      const updatedEvents = events.filter((event) => event.id !== currentEvent.id);
      setEvents(updatedEvents);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao apagar evento:', error);
      setError('Erro ao apagar evento');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">A carregar...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="text-center">
          Erro ao carregar eventos: {error}
        </Alert>
      </div>
    );
  }

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(events.length / eventsPerPage); i++) {
      pageNumbers.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="mt-3 justify-content-center">
        {pageNumbers}
      </Pagination>
    );
  };

  return (
    <div className="container mt-5">
      <h1>Gestão de Eventos</h1>
      
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID do Evento</th>
            <th>Nome</th>
            <th>Data</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.nome}</td>
              <td>{new Date(event.data).toLocaleDateString()}</td>
              <td>{event.ativo ? "Ativo" : "Inativo"}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditModalOpen(event)}>
                  Editar
                </Button>
                <Button variant="danger" className="ms-2" onClick={() => handleDeleteModalOpen(event)}>
                  Apagar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderPagination()}

      {/* Edit Event Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={newEventData.nome}
                onChange={(e) => setNewEventData({ ...newEventData, nome: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventDate" className="mt-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={newEventData.data}
                onChange={(e) => setNewEventData({ ...newEventData, data: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventLocation" className="mt-3">
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                value={newEventData.localizacao}
                onChange={(e) => setNewEventData({ ...newEventData, localizacao: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventDescription" className="mt-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEventData.descricao}
                onChange={(e) => setNewEventData({ ...newEventData, descricao: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventActive" className="mt-3">
              <Form.Check
                type="checkbox"
                label="Ativo"
                checked={newEventData.ativo}
                onChange={(e) => setNewEventData({ ...newEventData, ativo: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditEvent}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Modal (Pop-Up) de Apagar */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja apagar o evento <strong>{currentEvent.nome}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Apagar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventManagement;
