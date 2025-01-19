import React from 'react';
import { useLoaderData } from 'react-router-dom';

const Services = () => {
    const data = useLoaderData();
    return (
        <div>
            <h2>This is a service page</h2>
            <p>Total data : {data.length}</p>
        </div>
    );
};

export default Services;