import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const NavRight = () => {
  const navigate = useNavigate();

  const [perditeso, setPerditeso] = useState(Date.now());
  const [teDhenat, setTeDhenat] = useState('');
  const token = localStorage.getItem('token');
  const getID = localStorage.getItem('id');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    if (getID) {
      const vendosTeDhenat = async () => {
        try {
          const perdoruesi = await axios.get(`https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`, authentikimi);
          setTeDhenat(perdoruesi.data);
          console.log(teDhenat.data);
        } catch (err) {
          console.log(err);
        }
      };

      vendosTeDhenat();
    } else {
      navigate('/login');
    }
  }, [perditeso]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      const kohaAktive = new Date(decodedToken.exp * 1000);
      const kohaTanishme = new Date();
      const id = localStorage.getItem('id');

      if (kohaAktive < kohaTanishme) {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        navigate('/LogIn');
      }

      if (id !== decodedToken.id) {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        navigate('/LogIn');
      }
    }
  }, [perditeso]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    setPerditeso(Date.now());
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <Link to="/shporta">
            <i className="icon feather icon-shopping-cart" />
          </Link>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="start" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <Link to="/Dashboard">
                  <span style={{color:"white"}}>
                    {teDhenat && teDhenat.emri} {teDhenat && teDhenat.mbiemri}
                  </span>
                </Link>

                <Link to="/" className="dud-logout" title="Logout" onClick={handleSignOut}>
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="https://localhost:7251/Identity/Account/Manage" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/Dashboard/PorositEMia" className="dropdown-item">
                    <i className="feather icon-shopping-cart" /> Porosite
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/ListaEDeshirave" className="dropdown-item">
                    <i className="feather icon-heart" /> Lista e Deshirave
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/Dashboard/MesazhetEMia" className="dropdown-item">
                    <i className="feather icon-message-circle" /> Mesazhet e Mia
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavRight;
