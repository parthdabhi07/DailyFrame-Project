import React from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom';

export default function AuthenticatedRoute( {children} ) {

    const authContext = useAuth();

    if(authContext.isAuthenticated) {
        return children;
    }

    return <Navigate to="/" />
    // A component-based version of useNavigate to use in a React.Component Class where hooks are not
    // able to be used. It's recommended to avoid using this component in favor of useNavigate
}
