import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination, Spinner, Dropdown } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [centroIdFilter, setCentroIdFilter] = useState('');
  const [centrosDisponiveis, setCentrosDisponiveis] = useState([]);

  const usersPerPage = 10;

  useEffect(() => {
    fetchCentrosDisponiveis();
    fetchUsers(currentPage);
  }, [searchTerm, currentPage, centroIdFilter]);

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      let url = `https://backend-ai2-proj.onrender.com/user/list?page=${page}&limit=${usersPerPage}`;

      if (centroIdFilter) {
        url += `&centroId=${centroIdFilter}`;
      }

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

  const fetchCentrosDisponiveis = async () => {
    try {
      const response = await axios.get('https://backend-ai2-proj.onrender.com/centro/list');
      setCentrosDisponiveis(response.data);
    } catch (error) {
      console.error('Erro ao buscar centros disponíveis', error);
    }
  };

  const handleShow = (user = {}) => {
    setCurrentUser(user);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('nome', currentUser.nome);
      formData.append('email', currentUser.email);
      formData.append('password', currentUser.password);
      formData.append('centroId', currentUser.centroId);

      if (currentUser.id) {
        formData.append('id', currentUser.id); // incluir ID para atualização
      }
      if (currentUser.foto) {
        formData.append('foto', currentUser.foto); // incluir foto se presente
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      let url = 'https://backend-ai2-proj.onrender.com/user/';
      if (currentUser.id) {
        url += `update/${currentUser.id}`;
        await axios.put(url, formData, config);
      } else {
        url += 'add';
        await axios.post(url, formData, config);
      }

      setShow(false);
      fetchUsers(currentPage);
    } catch (error) {
      console.error('Erro ao salvar utilizador', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-ai2-proj.onrender.com/user/delete/${id}`);
      fetchUsers(currentPage);
    } catch (error) {
      console.error('Erro ao apagar utilizador', error);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backend-ai2-proj.onrender.com/user/find?search=${searchTerm}`
      );
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar utilizadores', error);
      setLoading(false);
    }
  };

  const handleFilterByCentro = async (centroId) => {
    try {
      setCentroIdFilter(centroId);
      setLoading(true);
      const response = await axios.get(
        `https://backend-ai2-proj.onrender.com/user/filterByCentro/${centroId}`
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao filtrar utilizadores por centro', error);
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setCurrentUser({});
    setShow(true);
  };

  const renderPagination = () => {
    const dataToDisplay = searchTerm ? searchResults : users;
    const totalUsers = dataToDisplay.length;
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

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = dataToDisplay.slice(indexOfFirstUser, indexOfLastUser);

    return (
      <tbody>
        {currentUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    overflow: 'hidden',
                    height: '50px',
                    width: '50px',
                    borderRadius: '50%',
                    marginRight: '10px'
                  }}
                >
                  <img
                    src={user.fotoUrl || 'https://via.placeholder.com/150'}
                    alt="Foto do usuário"
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                </div>
                {user.nome}
              </div>
            </td>
            <td>{user.email}</td>
            <td>{user.Centro ? user.Centro.centro : 'Centro não especificado'}</td>
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
        <Button variant="success" onClick={handleAddUser}>
          Adicionar Usuário
        </Button>
        <Form>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome, email ou ID"
            value={searchTerm}
            onChange={handleChange}
          />
        </Form>
      </div>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Filtrar por Centro
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {centrosDisponiveis.map((centro) => (
            <Dropdown.Item key={centro.id} onClick={() => handleFilterByCentro(centro.id)}>
              {centro.centro}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {loading ? (
        <Spinner animation="border" role="status" className="ml-3">
          <span className="sr-only">Carregando...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Centro</th>
              <th>Ações</th>
            </tr>
          </thead>
          {renderTableData()}
        </Table>
      )}
      {renderPagination()}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser.id ? 'Editar Utilizador' : 'Adicionar Utilizador'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Insira o nome"
              value={currentUser.nome || ''}
              onChange={(e) => setCurrentUser({ ...currentUser, nome: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Insira o email"
              value={currentUser.email || ''}
              onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formCentro">
            <Form.Label>Centro</Form.Label>
            <Form.Control
              as="select"
              value={currentUser.centroId || ''}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, centroId: parseInt(e.target.value) })
              }
            >
              <option value="">Selecionar Centro</option>
              {centrosDisponiveis.map((centro) => (
                <option key={centro.id} value={centro.id}>
                  {centro.centro}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Insira a senha"
              value={currentUser.password || ''}
              onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formFoto">
            <Form.Label>Foto</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setCurrentUser({ ...currentUser, foto: e.target.files[0] })}
            />
          </Form.Group>
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
