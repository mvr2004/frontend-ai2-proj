import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [centrosDisponiveis, setCentrosDisponiveis] = useState([]);
  const usersPerPage = 10;

  useEffect(() => {
    if (!searchTerm && currentPage === 1) {
      fetchUsers(1);
      fetchCentros();
    } else {
      handleSearch();
    }
  }, [searchTerm, currentPage]);

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const url = searchTerm
        ? `https://backend-ai2-proj.onrender.com/user/search?search=${searchTerm}&page=${page}&limit=${usersPerPage}`
        : `https://backend-ai2-proj.onrender.com/user/list?page=${page}&limit=${usersPerPage}`;
      const response = await axios.get(url);
      if (searchTerm) {
        setSearchResults(response.data);
      } else {
        setUsers(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users', error);
      setLoading(false);
    }
  };

  const fetchCentros = async () => {
    try {
      const response = await axios.get('https://backend-ai2-proj.onrender.com/centro/list');
      setCentrosDisponiveis(response.data);
    } catch (error) {
      console.error('Error fetching centers', error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://backend-ai2-proj.onrender.com/user/search?search=${searchTerm}&page=${currentPage}&limit=${usersPerPage}`);
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching users', error);
      setLoading(false);
    }
  };

  const handleShow = (user = {}) => {
    setCurrentUser(user);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSave = async () => {
    try {
      const { id, nome, email, password, centroId, Ativo, notas } = currentUser;

      // Definindo Ativo como booleano explícito
      const userToSave = {
        id,
        nome,
        email,
        password,
        centroId,
        Ativo: Ativo || false, // Garantindo que seja enviado como booleano explícito para o backend
        notas
      };

      if (id) {
        await axios.put(`https://backend-ai2-proj.onrender.com/user/update/${id}`, userToSave);
      } else {
        await axios.post('https://backend-ai2-proj.onrender.com/user/add', userToSave);
      }
      setShow(false);
      fetchUsers(currentPage);
    } catch (error) {
      console.error('Error saving user', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-ai2-proj.onrender.com/user/delete/${id}`);
      fetchUsers(currentPage);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const totalUsers = searchTerm ? searchResults.length : users.length;
    const numPages = Math.ceil(totalUsers / usersPerPage);

    let items = [];
    for (let number = 1; number <= numPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  const renderTableData = () => {
    const dataToDisplay = searchTerm ? searchResults : users;
    const startIndex = (currentPage - 1) * usersPerPage;
    const slicedUsers = dataToDisplay.slice(startIndex, startIndex + usersPerPage);

    return (
      <tbody>
        {slicedUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>
              <div className="user-info">
                <div className="user-avatar">
                  <img src={user.fotoUrl || 'https://via.placeholder.com/150'} alt="User's Avatar" />
                </div>
                <div className="user-details">
                  <div>{user.nome}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            </td>
            <td>{user.Centro ? user.Centro.centro : '-'}</td>
            <td className={user.Ativo ? '' : 'inactive-status'}>{user.Ativo ? 'Ativo' : 'Inativo'}</td>
            <td>
              <Button variant="warning" onClick={() => handleShow(user)} className="button-spacing">
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja apagar este utilizador?')) {
                    handleDelete(user.id);
                  }
                }}
                className="button-spacing"
              >
                Apagar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="container mt-5">
      <h1>Gestão de Utilizadores</h1>
      <div className="mb-3">
        <Form>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome, email ou ID"
            value={searchTerm}
            onChange={handleChange}
          />
        </Form>
      </div>
      <Button variant="primary" onClick={() => handleShow()} className="mb-3">
        Adicionar Novo Utilizador
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Centro</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                <Spinner animation="border" />
              </td>
            </tr>
          </tbody>
        ) : (
          renderTableData()
        )}
      </Table>
      {renderPagination()}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.id ? 'Editar Utilizador' : 'Adicionar Utilizador'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.nome || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, nome: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser.email || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite uma nova senha (opcional)"
                onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCentro">
              <Form.Label>Centro</Form.Label>
              <Form.Control
                as="select"
                value={currentUser.centroId || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, centroId: e.target.value })}
              >
                <option value="">Selecione um centro</option>
                {centrosDisponiveis.map((centro) => (
                  <option key={centro.id} value={centro.id}>
                    {centro.centro}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAtivo">
              <Form.Check
                type="checkbox"
                label="Ativo"
                checked={currentUser.Ativo || false}
                onChange={(e) => setCurrentUser({ ...currentUser, Ativo: e.target.checked })}
              />
            </Form.Group>
            <Form.Group controlId="formNotas">
              <Form.Label>Notas</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentUser.notas || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, notas: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
