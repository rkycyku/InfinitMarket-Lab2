import React from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import useWindowSize from '../../../../hooks/useWindowSize';
import NavSearch from './NavSearch';

const NavLeft = () => {
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
          <Dropdown align={dropdownAlign}>
            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
              Kategorite
            </Dropdown.Toggle>
            <ul>
              <Dropdown.Menu>
                <li>
                  <Link to="#" className="dropdown-item">
                    Smartphone
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    Laptop
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    TV
                  </Link>
                </li>
              </Dropdown.Menu>
            </ul>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <NavSearch windowWidth={windowSize.width} />
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;
