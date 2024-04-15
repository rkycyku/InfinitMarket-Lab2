import React from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import useWindowSize from '../../../../hooks/useWindowSize';
import NavSearch from './NavSearch';

import { useState, useEffect } from 'react';

const NavLeft = () => {
  const [kategorit, setKategorit] = useState([]);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqKateogrit = async () => {
      try {
        const kategoria = await axios.get('https://localhost:7251/api/Produktet/Kategoria/shfaqKategorit', authentikimi);
        setKategorit(kategoria.data);
        console.log(kategoria.data)
      } catch (err) {
        console.log(err);
      }
    };

    shfaqKateogrit();
  }, []);

  const windowSize = useWindowSize();

  let dropdownAlign = 'start';

  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'd-none'];
  }

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
          {/* <Dropdown align={dropdownAlign}>
            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
              Kategorite
            </Dropdown.Toggle>
            <ul>
              <Dropdown.Menu>
                {kategorit &&
                  kategorit.map((kat) => {
                    return (
                      <li>
                        <Link to={`/produktet/kategoria/${kat.kategoriaId}`} className="dropdown-item">
                          {kat.llojiKategoris}
                        </Link>
                      </li>
                    );
                  })}
              </Dropdown.Menu>
            </ul>
          </Dropdown> */}
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          {/* <NavSearch windowWidth={windowSize.width} /> */}
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;
