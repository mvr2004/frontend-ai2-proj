import React, { useState } from 'react';
import axios from 'axios';


const Login = () => {
    const [nome, setNome] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://backend-ai2-proj.onrender.com/admin/login', { nome, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard'); // Redireciona para o dashboard após login bem-sucedido
        } catch (error) {
            setError('Nome ou palavra-passe inválidos');
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
                            <h4 className="text-center mb-4">Bem-vindo ao Sistema de Administração!</h4>
                        </div>
                        <div className="card border border-light-subtle rounded-4">
                            <div className="card-body p-3 p-md-4 p-xl-5">
                                <form onSubmit={handleLogin}>
                                    <p className="text-center mb-4">Inicie Sessão na sua conta Admin</p>
                                    <div className="row gy-3 overflow-hidden">
                                        {/* INPUT UTILIZADOR */}
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="utilizador"
                                                    id="utilizador"
                                                    placeholder="Inserir Utilizador"
                                                    value={nome}
                                                    onChange={(e) => setNome(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="utilizador" className="form-label">Utilizador</label>
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
                                                    placeholder="Inserir Palavra-Passe"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="password" className="form-label">Palavra-Passe</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-grid">
                                                <button className="btn btn-primary btn-lg" type="submit">Log in</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center mt-4">
                            <Link to="/register" className="link-secondary text-decoration-none">Criar Conta</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
