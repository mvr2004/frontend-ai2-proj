import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/users/list?page=${currentPage}&limit=${usersPerPage}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar utilizadores', error);
    }
  };

  const handleShow = (user = {}) => {
    setCurrentUser(user);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSave = async () => {
    if (currentUser.id) {
      await axios.put(`/api/users/update/${currentUser.id}`, currentUser);
    } else {
      await axios.post('/api/users/add', currentUser);
    }
    setShow(false);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/users/delete/${id}`);
    fetchUsers();
  };

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <div className="container mt-5">
      <h1>Gestão de Utilizadores</h1>
      <Button variant="primary" onClick={() => handleShow()}>Adicionar Utilizador</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Centro ID</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.centroId}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow(user)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(user.id)} className="ml-2">Apagar</Button>
              </td>
            </tr>
          ))}
        </tbody>
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
              <Form.Control type="text" name="nome" value={currentUser.nome || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={currentUser.email || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formCentroId">
              <Form.Label>Centro ID</Form.Label>
              <Form.Control type="number" name="centroId" value={currentUser.centroId || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={currentUser.password || ''} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Fechar</Button>
          <Button variant="primary" onClick={handleSave}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
