import React, { useState, useEffect } from 'react';
import { Table, Spinner, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';

const ReportsList = ({ resolvido }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('https://backend-ai2-proj.onrender.com/report/reports');
        setReports(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
    return <div className="text-center mt-5">Erro ao carregar relatórios: {error}</div>;
  }
  
  const reportesFiltrados = reports.filter(report => report.resolvido === resolvido);

  //Receber os reportes atuais
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reportesFiltrados.slice(indexOfFirstReport, indexOfLastReport);

  //Mudar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(reportesFiltrados.length / reportsPerPage); i++) {
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
      <h1>Reportes</h1>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID do Reporte</th>
            <th>Assunto</th>
            <th>Nome do Utilizador</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.assunto}</td>
              <td>{report.User.nome}</td>
              <td>
                <Button variant="primary">
                  Ver Mais
                </Button>
                {report.resolvido ? (
                  <Button variant="success" className="ms-3" disabled>
                    Resolvido
                  </Button>
                ) : (
                  <Button variant="warning" className="ms-3">
                    Resolver
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderPagination()}
    </div>
  );
};

export default ReportsList;