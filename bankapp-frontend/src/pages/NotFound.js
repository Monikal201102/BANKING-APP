import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg my-4">Page Not Found</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  );
};

export default NotFound;
