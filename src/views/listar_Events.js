import React, { useState, useEffect } from 'react';
import { Table, Spinner, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  //Obter o Centro do administrador
  const [idCentro, setIdCentro] = useState(null);

  useEffect(() => {
    obterIDCentro();
    fetchEvents();
  }, []);

  const obterIDCentro = async () => {
    // Recupera o idCentro do localStorage
    const storedIdCentro = localStorage.getItem('idCentro');
    if (storedIdCentro) {
        setIdCentro(storedIdCentro);
    } else {
        setError('ID do centro não encontrado');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://backend-ai2-proj.onrender.com/eventos/list');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
    return <div className="text-center mt-5">Erro ao carregar eventos: {error}</div>;
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
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.nome}</td>
              <td>{new Date(event.data).toLocaleDateString()}</td>
              <td>
                <Button variant="primary">
                  Ver Mais
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderPagination()}
    </div>
  );
};

export default EventManagement;