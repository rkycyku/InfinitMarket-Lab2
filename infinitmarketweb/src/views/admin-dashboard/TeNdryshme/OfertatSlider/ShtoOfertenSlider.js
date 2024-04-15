import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import useKeyboardNavigation from '../../../../contexts/useKeyboardNavigation';

function ShtoOfertenSlider(props) {
  const [foto, setFoto] = useState(null);
  const [linkuOfertes, setLinkuOfertes] = useState('');
  const [dataFillimitOfertes, setDataFillimitOfertes] = useState(Date.now());
  const [dataMbarimtOfertes, setDataMbarimitOfertes] = useState(Date.now());
  const [llojiOfertes, setLlojiOfertes] = useState('OfertaEProduktit');

  const [produktet, setProduktet] = useState([]);
  const [kompanit, setKompanite] = useState([]);
  const [kategorite, setKategorite] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState(produktet);
  const selectedIndex = useKeyboardNavigation(filteredItems);


  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  const handleLinkuOfertesChange = (value) => {
    setLinkuOfertes(value);
  };

  const handleDataFillimitOfertesChange = (value) => {
    setDataFillimitOfertes(value);
  };

  const handleDataMbarimitOfertesChange = (value) => {
    setDataMbarimitOfertes(value);
  };

  const handleFotoChange = (event) => {
    setFoto(event.target.files[0]);
  };

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  async function handleSubmit() {
    const formData = new FormData();
    formData.append('foto', foto);

    try {
      await axios
        .post('https://localhost:7251/api/TeNdryshme/VendosFotot/ShtoOfertenSlider', formData, authentikimi)
        .then(async (response) => {
          axios
            .post(
              'https://localhost:7251/api/TeNdryshme/OfertatSlider/VendosOfertatSlider',
              {
                linkuOfertes: linkuOfertes,
                dataFillimitOfertes: dataFillimitOfertes,
                dataMbarimitOfertes: dataMbarimtOfertes,
                fotoOferta: response.data
              },
              authentikimi
            )
            .then((response) => {
              props.setTipiMesazhit('success');
              props.setPershkrimiMesazhit('Oferta u insertua me sukses!');
              props.perditesoTeDhenat();
              props.largo();
              props.shfaqmesazhin();
            })
            .catch((error) => {
              console.log(error);
            });
        });
    } catch (error) {
      console.error(error);
    }
  }

  const handleKontrolli = () => {
    if (isNullOrEmpty(linkuOfertes)) {
      setFushatEZbrazura(true);
    } else {
      handleSubmit();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);

    const filtered = partneret.filter((item) =>
      item.emriBiznesit.toLowerCase().includes(value)
    );

    setFilteredItems(filtered);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        handleNdryshoPartneri(filteredItems[selectedIndex]);
      }

      ndrroField(e, "pershkrimShtese");
    }
  };

  return (
    <>
      {fushatEZbrazura && (
        <Modal size="sm" show={fushatEZbrazura} onHide={() => setFushatEZbrazura(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'red' }} as="h6">
              Ndodhi nje gabim
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong style={{ fontSize: '10pt' }}>
              Ju lutemi plotesoni te gjitha fushat me <span style={{ color: 'red' }}>*</span>
            </strong>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" onClick={() => setFushatEZbrazura(false)} variant="secondary">
              Mbylle <FontAwesomeIcon icon={faXmark} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal className="modalEditShto" show={props.shfaq} onHide={() => props.largo()}>
        <Modal.Header closeButton>
          <Modal.Title>Shto Oferten</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Lloji Ofertes<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Check
                type="radio"
                label="Oferte e Produktit"
                name="llojiOfertes"
                id="OfertaEProduktit"
                defaultChecked
                onClick={() => setLlojiOfertes('OfertaEProduktit')}
              />
              <Form.Check
                type="radio"
                label="Oferte e Kategorise"
                name="llojiOfertes"
                id="OfertaEKategorise"
                onClick={() => setLlojiOfertes('OfertaEKategorise')}
              />
              <Form.Check
                type="radio"
                label="Oferte e Kompanise"
                name="llojiOfertes"
                id="OferteEKompanise"
                onClick={() => setLlojiOfertes('OferteEKompanise')}
              />
              <Form.Check type="radio" label="Njoftim" name="llojiOfertes" id="Njoftim" onClick={() => setLlojiOfertes('Njoftim')} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Linku Ofertes<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                onChange={(e) => handleLinkuOfertesChange(e.target.value)}
                value={linkuOfertes}
                type="text"
                placeholder="/produktet/2"
                autoFocus
                disabled={llojiOfertes == 'OfertaEProduktit'}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Partneri</Form.Label>
              <Form.Control
                type="text"
                className="form-control styled-input"
                placeholder="Zgjedhni Partnerin"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputChange}
              />

              <div className="container" style={{ position: 'relative' }}>
                <ul className="list-group mt-2 searchBoxi">
                  {filteredItems.map((item, index) => (
                    <li
                      key={item.idPartneri}
                      className={`list-group-item${selectedIndex === index ? ' active' : ''}`}
                      onClick={() => handleNdryshoPartneri(item)}
                    >
                      {item.emriBiznesit}
                    </li>
                  ))}
                </ul>
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Foto Ofertes<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                placeholder="Foto e Kompanis"
                onChange={handleFotoChange}
                required
                disabled={llojiOfertes == 'OfertaEProduktit'}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Data Fillimit Ofertes</Form.Label>
              <Form.Control
                onChange={(e) => handleDataFillimitOfertesChange(e.target.value)}
                value={dataFillimitOfertes}
                type="date"
                placeholder="dataFillimitOfertes Kompanis"
                disabled={llojiOfertes == 'OfertaEProduktit'}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Data Mbarimit Ofertes</Form.Label>
              <Form.Control
                onChange={(e) => handleDataMbarimitOfertesChange(e.target.value)}
                value={dataMbarimtOfertes}
                type="date"
                placeholder="dataFillimitOfertes Kompanis"
                disabled={llojiOfertes == 'OfertaEProduktit'}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.largo()}>
            Anulo <FontAwesomeIcon icon={faXmark} />
          </Button>
          <Button className="Butoni" onClick={handleKontrolli}>
            Shto Oferten <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShtoOfertenSlider;
