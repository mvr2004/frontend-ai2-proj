import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!searchTerm) {
      fetchUsers(currentPage);
    }
  }, [searchTerm, currentPage]); // Atualiza a pesquisa sempre que o searchTerm ou a página atual mudar

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`https://backend-ai2-proj.onrender.com/user/list?page=${page}&limit=${usersPerPage}`);
      setUsers(response.data);
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
    try {
      if (currentUser.id) {
        await axios.put(`https://backend-ai2-proj.onrender.com/user/update/${currentUser.id}`, currentUser);
      } else {
        await axios.post('https://backend-ai2-proj.onrender.com/user/add', currentUser);
      }
      setShow(false);
      fetchUsers(currentPage); // Sempre recarrega os usuários após salvar
    } catch (error) {
      console.error('Erro ao salvar utilizador', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-ai2-proj.onrender.com/user/delete/${id}`);
      fetchUsers(currentPage); // Sempre recarrega os usuários após deletar
    } catch (error) {
      console.error('Erro ao apagar utilizador', error);
    }
  };

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://backend-ai2-proj.onrender.com/user/search?search=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar utilizadores', error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
    handleSearch();
  };

  const renderPagination = () => {
    const totalUsers = searchTerm ? searchResults.length : users.length; // Determina o total de usuários a serem paginados
    const numPages = Math.ceil(totalUsers / usersPerPage);

    let items = [];
    for (let number = 1; number <= numPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  const renderTableData = () => {
    const dataToDisplay = searchTerm ? searchResults : users;

    return (
      <tbody>
        {dataToDisplay.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.nome}</td>
            <td>{user.email}</td>
            <td>{user.centroId}</td>
            <td>
              <Button variant="warning" onClick={() => handleShow(user)}>
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja apagar este utilizador?')) {
                    handleDelete(user.id);
                  }
                }}
                className="ml-2"
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
        <Form onSubmit={handleSearchSubmit}>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome, email ou ID"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <Button variant="primary" type="submit" className="ml-2">
            Pesquisar
          </Button>
        </Form>
      </div>
      <Button variant="primary" onClick={() => handleShow()}>
        Adicionar Utilizador
      </Button>
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
        {renderTableData()}
      </Table>
      {renderPagination()} {/* Sempre passa os resultados corretos para renderizar a paginação */}
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
              <Form.Control
                type="number"
                name="centroId"
                value={currentUser.centroId || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
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
