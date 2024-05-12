import PropTypes from 'prop-types';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavGroup from './NavGroup';

const NavContent = ({ navigation }) => {
  
  const [perditeso, setPerditeso] = useState('');
  const [teDhenat, setTeDhenat] = useState([]);
  
  const getID = localStorage.getItem('id');

  
  const navigate = useNavigate();

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
          const rolet = await axios.get(`https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`, authentikimi);

          setTeDhenat(rolet.data);
        } catch (err) {
          console.log(err);
        } 
      };

      vendosTeDhenat();
    } else {
      navigate('/login');
    }
  }, [perditeso]);

  const navItems = navigation.map((item) => {
    if (item.type == 'group') {
        return <NavGroup key={'nav-group-' + item.id} group={item} />;
    }else if(item.type == 'group admin' && (teDhenat && teDhenat.rolet && teDhenat.rolet.includes("Admin"))){
      return <NavGroup key={'nav-group-' + item.id} group={item} />;
    }else if(item.type == 'group shites' && (teDhenat && teDhenat.rolet && teDhenat.rolet.includes("Shites"))){
      return <NavGroup key={'nav-group-' + item.id} group={item} />;
    }else{
      return false;
    }
  });

  let mainContent = '';

  mainContent = (
    <div className="navbar-content datta-scroll">
      <PerfectScrollbar>
        <ListGroup variant="flush" as="ul" bsPrefix=" " className="nav pcoded-inner-navbar" id="nav-ps-next">
          {navItems}
        </ListGroup>
      </PerfectScrollbar>
    </div>
  );

  return <React.Fragment>{mainContent}</React.Fragment>;
};

NavContent.propTypes = {
  navigation: PropTypes.array
};

export default NavContent;
