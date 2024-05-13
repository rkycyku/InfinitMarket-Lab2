import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

function KontrolloAksesinNeFunksione(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const kontrolloAksesin = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.role.includes('Admin')) {
          } else {
            props.setTipiMesazhit('danger');
            props.setPershkrimiMesazhit('<h2>403 - Nuk keni akses!</h2>');
            props.perditesoTeDhenat();
            props.shfaqmesazhin();
            props.largo();
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

  return (
    <div>
    </div>
  );
}

export default KontrolloAksesinNeFunksione;
