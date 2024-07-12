import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
    return (
        <div>
            {/* AZUL */}
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'black' }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src="./images/logo-softinsa.png" alt="logo softinsa" width="100" />
                    </a>
                    <a className="navbar-brand" href="#!">Dashboard</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#!">Features</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                        </ul>
                        <span className="navbar-text">
                            Navbar text with an inline element
                        </span>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navigation;
