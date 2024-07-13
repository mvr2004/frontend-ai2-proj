import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

const Dashboard = () => {
    const [idCentro, setIdCentro] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Recupera o idCentro do localStorage
        const storedIdCentro = localStorage.getItem('idCentro');
        if (storedIdCentro) {
            setIdCentro(storedIdCentro);
        } else {
            setError('ID do centro não encontrado');
        }
    }, []);

    return(
        <div>
            Pagina dashboard

            <h1>idCentro = {idCentro}</h1>
        </div>
    )
}

export default Dashboard;