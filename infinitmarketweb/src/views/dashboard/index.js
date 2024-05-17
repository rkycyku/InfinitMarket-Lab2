import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';




import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Titulli from '../../components/Titulli';





const DashDefault = () => {
  const [eshteStudent, setEshteStudent] = useState(false);
  const [teDhenat, setTeDhenat] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [loading, setLoading] = useState(true);
   

  const [resetoFaqen, setResetoFaqen] = useState(0);

  const navigate = useNavigate();

  const getID = localStorage.getItem('id');

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    if (getID) {
      const vendosTeDhenat = async () => {
        try {
          const perdoruesi = await axios.get(`https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`, authentikimi);

          setTeDhenat(perdoruesi.data);

          setResetoFaqen((prevCount) => prevCount + 1);

          console.log(perdoruesi.data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      vendosTeDhenat();
    } else {
      navigate('/login');
    }
  }, [perditeso]);

  return (
    <React.Fragment>
      <Titulli titulli={'Dashboard'} />
      {window.location.href = "https://localhost:7251/Identity/Account/Manage"}
    </React.Fragment>
  );
};

export default DashDefault;
