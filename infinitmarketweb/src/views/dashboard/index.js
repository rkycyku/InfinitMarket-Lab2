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
      <Row>
        <div className="dashboard">
          <div className="containerDashboard">
            <h3 className="titulliPershkrim">Te dhenat personale</h3>
            <Tabs defaultActiveKey="InformatatPersonale" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="InformatatPersonale" title="Informatat Personale">
                <table>
                  <tr>
                    <td>
                      <strong>Përdoruesi:</strong>
                    </td>
                    <td>{teDhenat && teDhenat.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Emri:</strong>
                    </td>
                    <td>{teDhenat && teDhenat.emri}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Mbiemri: </strong>
                    </td>
                    <td>{teDhenat && teDhenat.mbiemri}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Datëlindja: </strong>
                    </td>
                    <td>
                      {new Date(teDhenat && teDhenat.teDhenatPerdoruesit && teDhenat.teDhenatPerdoruesit.dataLindjes).toLocaleDateString(
                        'en-GB',
                        { dateStyle: 'short' }
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Gjinia: </strong>
                    </td>
                    <td>{teDhenat && teDhenat.teDhenatPerdoruesit && teDhenat.teDhenatPerdoruesit.gjinia}</td>
                  </tr>
                </table>
              </Tab>
              <Tab eventKey="Kontakti" title="Kontakti">
                <table>
                  <tr>
                    <td>
                      <strong>Shteti:</strong>
                    </td>
                    <td>{teDhenat && teDhenat.teDhenatPerdoruesit && teDhenat.teDhenatPerdoruesit.shteti}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Vendbanimi:</strong>
                    </td>
                    <td>{teDhenat && teDhenat.teDhenatPerdoruesit && teDhenat.teDhenatPerdoruesit.qyteti}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Adresa:</strong>
                    </td>
                    <td>{teDhenat && teDhenat.teDhenatPerdoruesit && teDhenat.teDhenatPerdoruesit.adresa}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ZipKodi:</strong>
                    </td>
                    <td>{teDhenat && teDhenat.teDhenatPerdoruesit && teDhenat.teDhenatPerdoruesit.zipKodi}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Telefon:</strong>
                    </td>
                    <td>{teDhenat && teDhenat.teDhenatPerdoruesit && teDhenat.teDhenatPerdoruesit.nrKontaktit}</td>
                  </tr>
                </table>
              </Tab>
            </Tabs>
          </div>
        </div>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
