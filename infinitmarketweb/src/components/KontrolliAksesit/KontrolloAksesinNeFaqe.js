import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

function KontrolloAksesinNeFaqe(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const kontrolloAksesin = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (
            props.vetemAdmin
              ? decodedToken.role.includes('Admin')
              : decodedToken.role.includes('Admin') || decodedToken.role.includes('Shites')
          ) {
          } else {
            navigate('/403');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        navigate('/login');
      }
    };

    kontrolloAksesin();
  }, []);

  return <div></div>;
}

export default KontrolloAksesinNeFaqe;
