// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const PrivateRoute = () => {
//     const isLoggedIn = localStorage.getItem('isLoggedIn');
//     return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;








// src/components/PrivateRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    // ✅ FIX: Check for the presence of the authentication token
    const token = localStorage.getItem('token'); 
    
    // If a token exists, render the child routes, otherwise redirect to login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;