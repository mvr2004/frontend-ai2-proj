import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [nome, setNome] = useState('');
    const [password, setPassword] = useState('');
    const [centroId, setCentroId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://backend-ai2-proj.onrender.com/admin/registar', { nome, password, centroId });
            if (response.data.success) {
                // Registro bem-sucedido
                alert(response.data.message);
                navigate('/login'); // Redireciona para a página de login após registro bem-sucedido
            } else {
                // Registro falhou
                setError(response.data.message || 'Erro ao registrar');
            }
        } catch (error) {
            setError('Erro ao registrar: ' + error.message);
        }
    };

    return (
        <div className="bg-light py-3 py-md-5 py-xl-8">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <div className="mb-5">
                            <div className="text-center mb-4">
                                <a href="#!">
                                    <img src="./images/logo-softinsa.png" alt="Softinsa Logo" width="300"/>
                                </a>
                            </div>
                            <h4 className="text-center mb-4">Registar como Administrador</h4>
                        </div>
                        <div className="card border border-light-subtle rounded-4">
                            <div className="card-body p-3 p-md-4 p-xl-5">
                                <form onSubmit={handleRegister}>
                                    <p className="text-center mb-4">Criar conta Admin</p>
                                    <div className="row gy-3 overflow-hidden">
                                        {/* INPUT NOME */}
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="nome"
                                                    id="nome"
                                                    placeholder="Inserir utilizador"
                                                    value={nome}
                                                    onChange={(e) => setNome(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="nome" className="form-label">Utilizador</label>
                                            </div>
                                        </div>
                                        {/* INPUT PALAVRA-PASSE */}
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="password"
                                                    id="password"
                                                    placeholder="Insira sua palavra-passe"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="password" className="form-label">Palavra-Passe</label>
                                            </div>
                                        </div>
                                        {/* INPUT ID DO CENTRO */}
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="centroId"
                                                    id="centroId"
                                                    placeholder="Insira o ID do centro"
                                                    value={centroId}
                                                    onChange={(e) => setCentroId(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="centroId" className="form-label">ID do Centro</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-grid">
                                                <button className="btn btn-primary btn-lg" type="submit">Registrar</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                {error && <p className="text-danger mt-3">{error}</p>}
                            </div>
                        </div>
                        <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center mt-4">
                            <a href="/login" className="link-secondary text-decoration-none">Já tem uma conta? Faça login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
