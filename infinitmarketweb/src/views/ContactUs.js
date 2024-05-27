import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Mesazhi from '../components/Mesazhi';
import { Form, FloatingLabel, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import Titulli from '../components/Titulli';

const ContactUs = () => {
  const [emri, setEmri] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [user, setUser] = useState([]);
  const [perditeso, setPerditeso] = useState('');

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
          const teDhenat = await axios.get(`https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`, authentikimi);
          setUser(teDhenat.data);
          console.log(teDhenat.data);
        } catch (err) {
          console.log(err);
        }
      };
      vendosTeDhenat();
    }
  }, [perditeso]);

  function vendosEmrin(value) {
    setEmri(value);
  }
  function vendosEmail(value) {
    setEmail(value);
  }
  function vendosMesazhin(value) {
    setMsg(value);
  }
  function dergoMesazhin() {
    axios
      .post(
        'https://localhost:7251/api/TeNdryshme/ContactForm/shtoMesazhin',
        {
          mesazhi: msg,
          emri: emri,
          email: email,
          userId: getID ? user.teDhenatPerdoruesit.userID : null
        },
        authentikimi
      )
      .then((response) => {
        setTipiMesazhit('success');
        setPershkrimiMesazhit('Mesazhi u Dergua me Sukses!');
        setShfaqMesazhin(true);
        setEmri('');
        setEmail('');
        setMsg('');
      })
      .catch((error) => {
        console.log(error);
        setTipiMesazhit('danger');
        setPershkrimiMesazhit('Na vjen keq! Mesazhi nuk u dergua, Ju lutemi provoni me vone');
        setShfaqMesazhin(true);
      });
  }

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  const handleKontrolli = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isNullOrEmpty(msg) || isNullOrEmpty(emri) || isNullOrEmpty(email)) {
      setTipiMesazhit('danger');
      setPershkrimiMesazhit('Ju lutemi plotesoni te gjitha fushat me <span style="color: red;">*</span>');
      setShfaqMesazhin(true);
    } else {
      if (!emailRegex.test(email)) {
        setTipiMesazhit('danger');
        setPershkrimiMesazhit('Ju lutem shenoni nje email valid!');
        setShfaqMesazhin(true);
      } else {
        dergoMesazhin();
      }
    }
  };

  return (
    <div className="body">
      <Titulli titulli={'Contact Us'} />
      {shfaqMesazhin && <Mesazhi tipi={tipiMesazhit} pershkrimi={pershkrimiMesazhit} setShfaqMesazhin={setShfaqMesazhin} />}
      <div className="forms">
        <Form className="form">
          <h2 className="text-center mb-5">Contact Us</h2>
          <FloatingLabel controlId="floatingInput" label="Emri*" className="mb-3">
            <Form.Control className="inputt" value={emri} placeholder="Email" type="text" onChange={(e) => vendosEmrin(e.target.value)} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Email*" className="mb-3">
            <Form.Control className="inputt" value={email} type="text" placeholder="Email" onChange={(e) => vendosEmail(e.target.value)} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Mesazhi Juaj*">
            <Form.Control
              className="inputt"
              value={msg}
              as="textarea"
              style={{ height: '150px' }}
              placeholder="Mesazhi Juaj"
              onChange={(e) => vendosMesazhin(e.target.value)}
            />
          </FloatingLabel>
          <Button className="button mt-4" onClick={handleKontrolli}>
            Send <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
          </Button>
        </Form>
      </div>

      <Footer />
    </div>
  );
};
export default ContactUs;
