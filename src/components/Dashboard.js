import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

const Dashboard = () => {

    return(
        <div>
            <Navigation />
            Pagina dashboard
        </div>
    )
}

export default Dashboard;
