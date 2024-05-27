import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import useKeyboardNavigation from '../../../../contexts/useKeyboardNavigation';
import KontrolloAksesinNeFunksione from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione';

function ShtoOfertenSlider(props) {
  const [foto, setFoto] = useState(null);
  const [linkuOfertes, setLinkuOfertes] = useState('PaLink');
  const [dataFillimitOfertes, setDataFillimitOfertes] = useState(Date.now());
  const [dataMbarimtOfertes, setDataMbarimitOfertes] = useState(Date.now());
  const [llojiOfertes, setLlojiOfertes] = useState('OfertaEProduktit');

  const [perditeso, setPerditeso] = useState(Date.now());

  const [produktet, setProduktet] = useState([]);
  const [kompanit, setKompanite] = useState([]);
  const [kategorite, setKategorite] = useState([]);

  const [inputValue, setInputValue] = useState('');
  const [filteredItemsProduktet, setFilteredItemsProduktet] = useState(produktet);
  const [filteredItemsKompanit, setFilteredItemsKompanit] = useState(kompanit);
  const [filteredItemsKategorit, setFilteredItemsKategorit] = useState(kategorite);
  const selectedIndexProduktet = useKeyboardNavigation(filteredItemsProduktet);
  const selectedIndexKompanit = useKeyboardNavigation(filteredItemsKompanit);
  const selectedIndexKategorit = useKeyboardNavigation(filteredItemsKategorit);

  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const VendosTeDhenat = async () => {
      try {
        const produktet = await axios.get(`https://localhost:7251/api/Produktet/Produkti/ShfaqProduktet`, authentikimi);
        const kategorite = await axios.get(`https://localhost:7251/api/Produktet/Kategoria/shfaqKategorit`, authentikimi);
        const kompanite = await axios.get(`https://localhost:7251/api/Produktet/Kompania/shfaqKompanit`, authentikimi);
        setProduktet(produktet.data);
        setKompanite(kompanite.data);
        setKategorite(kategorite.data);
      } catch (err) {
        console.log(err);
      }
    };

    VendosTeDhenat();
  }, [perditeso]);

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

  const handleInputChangeProdukti = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);
    const filtered = produktet.filter((item) => item.emriProduktit.toLowerCase().includes(value));
    setFilteredItemsProduktet(filtered);
  };
  const handleInputKeyDownProdukti = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItemsProduktet.length > 0) {
        handleNdryshoProduktin(filteredItemsProduktet[selectedIndexProduktet]);
      }
      ndrroField(e, 'fotoOfertes');
    }
  };
  function handleNdryshoProduktin(produkti) {
    setLinkuOfertes('/produktet/' + produkti.produktiId);
    setFilteredItemsProduktet([]);
    setInputValue(`${produkti?.emriProduktit ? produkti.emriProduktit : ''}`);
  }

  const handleInputChangeKategoria = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);
    const filtered = kategorite.filter((item) => item.llojiKategoris.toLowerCase().includes(value));
    setFilteredItemsKategorit(filtered);
  };
  const handleInputKeyDownKategoria = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItemsKategorit.length > 0) {
        handleNdryshoKategorin(filteredItemsKategorit[selectedIndexKategorit]);
      }
      ndrroField(e, 'fotoOfertes');
    }
  };
  function handleNdryshoKategorin(kategoria) {
    setLinkuOfertes('/produktet/kategoria/' + kategoria.llojiKategoris);
    setFilteredItemsKategorit([]);
    setInputValue(`${kategoria?.llojiKategoris ? kategoria.llojiKategoris : ''}`);
  }

  const handleInputChangeKompania = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);
    const filtered = kompanit.filter((item) => item.emriKompanis.toLowerCase().includes(value));
    setFilteredItemsKompanit(filtered);
  };
  const handleInputKeyDownKompania = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItemsKompanit.length > 0) {
        handleNdryshoKompania(filteredItemsKompanit[selectedIndexKompanit]);
      }
      ndrroField(e, 'fotoOfertes');
    }
  };
  function handleNdryshoKompania(kompania) {
    setLinkuOfertes('/produktet/kompania/' + kompania.emriKompanis);
    setFilteredItemsProduktet([]);
    setInputValue(`${kompania?.emriKompanis ? kompania.emriKompanis : ''}`);
  }

  const ndrroField = (e, tjetra) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById(tjetra).focus();
    }
  };

  return (
    <>
      <KontrolloAksesinNeFunksione
        largo={() => props.largo()}
        shfaqmesazhin={() => props.shfaqmesazhin()}
        perditesoTeDhenat={() => props.perditesoTeDhenat()}
        setTipiMesazhit={(e) => props.setTipiMesazhit(e)}
        setPershkrimiMesazhit={(e) => props.setPershkrimiMesazhit(e)}
      />
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
                onClick={() => {
                  setLlojiOfertes('OfertaEProduktit');
                  setInputValue('');
                }}
              />
              <Form.Check
                type="radio"
                label="Oferte e Kategorise"
                name="llojiOfertes"
                id="OfertaEKategorise"
                onClick={() => {
                  setLlojiOfertes('OfertaEKategorise');
                  setInputValue('');
                }}
              />
              <Form.Check
                type="radio"
                label="Oferte e Kompanise"
                name="llojiOfertes"
                id="OferteEKompanise"
                onClick={() => {
                  setLlojiOfertes('OferteEKompanise');
                  setInputValue('');
                }}
              />
              <Form.Check
                type="radio"
                label="Link i Ndryshem"
                name="llojiOfertes"
                id="LinkINdryshem"
                onClick={() => {
                  setLlojiOfertes('LinkINdryshem');
                  setInputValue('');
                  setLinkuOfertes('');
                }}
              />
              <Form.Check
                type="radio"
                label="Njoftim"
                name="llojiOfertes"
                id="Njoftim"
                onClick={() => {
                  setLlojiOfertes('Njoftim');
                  setInputValue('');
                  setLinkuOfertes('PaLink');
                }}
              />
            </Form.Group>
            {llojiOfertes == 'OfertaEProduktit' && (
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Produkti</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control styled-input"
                  placeholder="Zgjedhni Produktin"
                  value={inputValue}
                  onChange={handleInputChangeProdukti}
                  onKeyDown={handleInputKeyDownProdukti}
                  onFocus={handleInputChangeProdukti}
                />
                <div className="container" style={{ position: 'relative' }}>
                  <ul className="list-group mt-2 searchBoxi">
                    {filteredItemsProduktet.map((item, index) => (
                      <li
                        key={item.produktiId}
                        className={`list-group-item${selectedIndexProduktet === index ? ' active' : ''}`}
                        onClick={() => handleNdryshoProduktin(item)}
                      >
                        {item.emriProduktit}
                      </li>
                    ))}
                  </ul>
                </div>
              </Form.Group>
            )}
            {llojiOfertes == 'OfertaEKategorise' && (
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Kategoria</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control styled-input"
                  placeholder="Zgjedhni Kategorin"
                  value={inputValue}
                  onChange={handleInputChangeKategoria}
                  onKeyDown={handleInputKeyDownKategoria}
                  onFocus={handleInputChangeKategoria}
                />
                <div className="container" style={{ position: 'relative' }}>
                  <ul className="list-group mt-2 searchBoxi">
                    {filteredItemsKategorit.map((item, index) => (
                      <li
                        key={item.kategoriaId}
                        className={`list-group-item${selectedIndexKategorit === index ? ' active' : ''}`}
                        onClick={() => handleNdryshoKategorin(item)}
                      >
                        {item.llojiKategoris}
                      </li>
                    ))}
                  </ul>
                </div>
              </Form.Group>
            )}
            {llojiOfertes == 'OferteEKompanise' && (
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Kompania</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control styled-input"
                  placeholder="Zgjedhni Kompanin"
                  value={inputValue}
                  onChange={handleInputChangeKompania}
                  onKeyDown={handleInputKeyDownKompania}
                  onFocus={handleInputChangeKompania}
                />
                <div className="container" style={{ position: 'relative' }}>
                  <ul className="list-group mt-2 searchBoxi">
                    {filteredItemsKompanit.map((item, index) => (
                      <li
                        key={item.kompaniaID}
                        className={`list-group-item${selectedIndexKompanit === index ? ' active' : ''}`}
                        onClick={() => handleNdryshoKompania(item)}
                      >
                        {item.emriKompanis}
                      </li>
                    ))}
                  </ul>
                </div>
              </Form.Group>
            )}
            {llojiOfertes == 'LinkINdryshem' && (
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Linku</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control styled-input"
                  placeholder="Vendosni Linkun"
                  value={linkuOfertes}
                  onChange={(e) => setLinkuOfertes(e.target.value)}
                  autoFocus
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Foto Ofertes<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control type="file" accept="image/*" placeholder="Foto Ofertes" id="fotoOfertes" onChange={handleFotoChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="dataFillimitOfertes">
              <Form.Label>Data Fillimit Ofertes</Form.Label>
              <Form.Control
                onChange={(e) => handleDataFillimitOfertesChange(e.target.value)}
                value={dataFillimitOfertes}
                type="date"
                placeholder="dataFillimitOfertes Kompanis"
                id="dataFillimitOfertes"
                name="dataFillimitOfertes"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Data Mbarimit Ofertes</Form.Label>
              <Form.Control
                onChange={(e) => handleDataMbarimitOfertesChange(e.target.value)}
                value={dataMbarimtOfertes}
                type="date"
                placeholder="dataFillimitOfertes Kompanis"
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
