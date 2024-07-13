import React, { useState, useEffect } from 'react';
import { Card, Spinner, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const VerReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`https://backend-ai2-proj.onrender.com/report/reports/${id}`);
        setReport(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleResolve = async () => {
    try {
      const response = await axios.put(`https://backend-ai2-proj.onrender.com/report/update/${id}`, {
        resolvido: !report.resolvido
      });
      if (response.data.success) {
        setReport({ ...report, resolvido: !report.resolvido });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Erro ao atualizar o status do report');
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
    return <div className="text-center mt-5">Erro ao carregar o reporte: {error}</div>;
  }

  if (!report) {
    return <div className="text-center mt-5">Reporte não encontrado</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Detalhes do Reporte</h1>
      <Card className="mt-3">
        <Card.Body>
          <Row>
            <Col md={4}>
              <div className="text-center">
                <img
                    src={report.imageUrl}
                    alt="Imagem não encontrada"
                    style={{ 
                        maxWidth: '250px',
                        maxHeight: '250px' 
                    }}
                  />
              </div>
            </Col>
            <Col md={8}>
              <Card.Title>Report #{report.id}</Card.Title>
              <Card.Text>
                <strong>Assunto:</strong> {report.assunto}<br />
                <strong>Descrição:</strong> {report.descriscao}<br />
                <strong>Utilizador:</strong> {report.User.nome} ({report.User.email})<br />
                <strong>Estado:</strong> {report.resolvido ? 'Resolvido' : 'Pendente'}<br />
              </Card.Text>
              {!report.resolvido && (
                <Button variant="warning" onClick={handleResolve}>
                  Resolver
                </Button>
              )}
              <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
                Voltar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VerReport;