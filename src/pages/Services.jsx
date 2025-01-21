import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const Services = () => {
    // loader: () => fetch('http://localhost:5000/services', {credentials: 'include'})
    // const data = useLoaderData();
    const [services, setServices] = useState([]);
    const axiosSecure = useAxiosSecure();
    useEffect(() => {
        // axios.get(`http://localhost:5000/services`, {withCredentials: true})
        axiosSecure.get('/services')
        .then(res => setServices(res.data))
    }, [])
    return (
        <div>
            <h2>This is a service page</h2>
            <p>Total data : {services.length}</p>
        </div>
    );
};

export default Services;