import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination, Spinner } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // Para indicar quando a busca está em progresso
  const usersPerPage = 10; // Reduzi para 5 para facilitar a visualização, você pode ajustar conforme necessário

  useEffect(() => {
    if (!searchTerm && currentPage === 1) {
      fetchUsers(1); // Busca todos os usuários na página 1 se a barra de pesquisa estiver vazia
    } else {
      handleSearch(); // Executa a pesquisa quando há um searchTerm definido
    }
  }, [searchTerm, currentPage]); // Atualiza a pesquisa sempre que o searchTerm ou a página atual mudar

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
      console.error('Erro ao buscar utilizadores', error);
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
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reinicia para a primeira página ao alterar o termo de pesquisa
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backend-ai2-proj.onrender.com/user/search?search=${searchTerm}`
      );
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar utilizadores', error);
      setLoading(false);
    }
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

    // Lógica para calcular os usuários que devem ser exibidos na página atual
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = dataToDisplay.slice(indexOfFirstUser, indexOfLastUser);

    return (
      <tbody>
        {currentUsers.map((user) => (
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
        <Form>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome, email ou ID"
            value={searchTerm}
            onChange={handleChange}
          />
        </Form>
      </div>
      <Button variant="primary" onClick={() => handleShow()}>
        Adicionar Utilizador
      </Button>
      {loading ? (
        <Spinner animation="border" role="status" className="ml-3">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      ) : (
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
      )}
      {renderPagination()}
      {/* Sempre passa os resultados corretos para renderizar a paginação */}
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
                name="nome"
                value={currentUser.nome || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, nome: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUser.email || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCentroId">
              <Form.Label>Centro ID</Form.Label>
              <Form.Control
                type="number"
                name="centroId"
                value={currentUser.centroId || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, centroId: e.target.value })}
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
