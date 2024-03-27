import './Styles/Footer.css';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

import { useState, useEffect } from 'react';
import axios from 'axios';

function Footer(props) {
  const [teDhenatBiznesit, setTeDhenatBiznesit] = useState([]);
  const [perditeso, setPerditeso] = useState('');

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const ShfaqTeDhenat = async () => {
      try {
        const teDhenat = await axios.get('https://localhost:7285/api/TeDhenatBiznesit/ShfaqTeDhenat', authentikimi);
        setTeDhenatBiznesit(teDhenat.data);
      } catch (err) {
        console.log(err);
      }
    };

    ShfaqTeDhenat();
  }, [perditeso]);

  return (
    <footer>
      <div className="footer">
        <div className="footerLogo">
          {/* {teDhenatBiznesit && (teDhenatBiznesit.logo === null || teDhenatBiznesit.logo === "") ?
                        <Link to="/">
                            <h1>{teDhenatBiznesit.shkurtesaEmritBiznesit}</h1>
                        </Link> :
                        <Link className="logo" to="/">
                            <img src={`${process.env.PUBLIC_URL}/img/web/${teDhenatBiznesit.logo}`} alt="" />
                        </Link>
                    } */}
          <Link className="logo" to="/">
            <img src={`${process.env.PUBLIC_URL}/img/InfiniteMarketLogo/favico.png`} alt="" />
          </Link>
        </div>
        <div className="footerNav">
          <h2 className="footerNavTitle">Quick Links</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">Products</Link>
            </li>
            <li>
              <Link to="/">About Us</Link>
            </li>
            <li>
              <Link to="/">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className="footerContact">
          <h2 className="footerNavTitle">Get in touch</h2>
          <ul>
            {/* <li>
              <a href={teDhenatBiznesit && 'tel:' + teDhenatBiznesit.nrKontaktit}>{teDhenatBiznesit && teDhenatBiznesit.nrKontaktit}</a>
            </li>
            <li>
              <a href={teDhenatBiznesit && 'mailto:' + teDhenatBiznesit.email}>{teDhenatBiznesit && teDhenatBiznesit.email}</a>
            </li>
            <li style={{ color: 'black' }}>{teDhenatBiznesit && teDhenatBiznesit.adresa}</li> */}
            <li>
              <a href='tel:+38343434342'>+383 43 43 43 42</a>
            </li>
            <li>
              <a href='mailto:contact@infinitmarket.com'>contact@infinitmarket.com</a>
            </li>
            <li style={{ color: 'black' }}>Prishtine, Kosove, 10000</li>
          </ul>
          <div className="footerSocialIcons">
            <a href="https://facebook.com">
              <i>
                <FontAwesomeIcon icon={faFacebook} />
              </i>
            </a>
            <a href="https://instagram.com">
              <i>
                <FontAwesomeIcon icon={faInstagram} />
              </i>
            </a>
            <a href="https://twitter.com">
              <i>
                <FontAwesomeIcon icon={faTwitter} />
              </i>
            </a>
          </div>
        </div>
      </div>
      <div className="copyright">
        <FontAwesomeIcon icon={faCopyright} /> {teDhenatBiznesit && teDhenatBiznesit.emriIbiznesit}
      </div>
    </footer>
  );
}

export default Footer;
