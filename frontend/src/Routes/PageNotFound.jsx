import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="w-full flex items-center justify-center h-screen bg-primary-500 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 animate-bounce">404</h1>
        <p className="text-2xl mb-8">Page not found</p>
        <Link to="/" className="bg-primary-300 text-primary-900 py-2 px-4 rounded-full text-lg hover:bg-primary-400 hover:text-primary-800 transition duration-300 ease-in-out">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
