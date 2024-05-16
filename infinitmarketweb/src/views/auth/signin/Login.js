import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Titulli from '../../../components/Titulli';

const Signin1 = () => {
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    console.log(token);

    setTimeout(() => {
      if (token) {
        localStorage.setItem('token', token);

        const decodedToken = jwt_decode(token);

        localStorage.setItem('id', decodedToken.id);

        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload();
        }, 200);
      } else {
        window.location.href = 'https://localhost:7251/Identity/Account/Logout?returnUrl=%2F';
      }
    }, 400);
  }, [location.search]);

  return (
    <React.Fragment>
      <Titulli titulli={'Log In'} />
    </React.Fragment>
  );
};

export default Signin1;
