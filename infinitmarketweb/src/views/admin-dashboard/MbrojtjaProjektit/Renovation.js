import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPenToSquare, faPlus, faClose, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Tabela from '../../../components/Tabela/Tabela';

function Renovation() {
  const [Renovation, setRenovation] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shto, setShto] = useState(false);
  const [edito, setEdito] = useState(false);
  const [fshij, setFshij] = useState(false);
  const [id, setId] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const shfaqRenovation = async () => {
      try {
        const Renovation = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Renovation/ShfaqRenovation');
        setRenovation(
          Renovation.data.map((k) => ({
            ID: k.renovationID,
            Description: k.description,
            Cost: parseFloat(k.cost) + ' €',
            Building: (k.building && k.building.name) + ' - ' + (k.building && k.building.location)
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };

    shfaqRenovation();
  }, [perditeso]);

  // SHTO
  const [Building, setBuilding] = useState([]);

  useEffect(() => {
    const shfaqBuilding = async () => {
      try {
        const Building = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Building/ShfaqBuilding');
        setBuilding(Building.data);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqBuilding();
  }, [perditeso]);

  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [building, setbuilding] = useState('');

  const handledescriptionChange = (value) => {
    setDescription(value);
  };
  const handlecostChange = (value) => {
    setCost(value);
  };
  const handlebuildingChange = (value) => {
    setbuilding(value);
  };
  // SHTO

  // Edito
  const [renovation, setrenovation] = useState([]);

  const handledescription = (value) => {
    setrenovation((prev) => ({ ...prev, description: value }));
  };
  const handlecost = (value) => {
    setrenovation((prev) => ({ ...prev, cost: value }));
  };
  const handlebuilding = (value) => {
    setrenovation((prev) => ({ ...prev, buildingID: value }));
  };

  useEffect(() => {
    const vendosTeDhenat = async () => {
      try {
        const teDhenatRenovation = await axios.get(
          `https://localhost:7251/api/MbrojtjaEProjektit/Renovation/ShfaqRenovationNgaID?RenovationID=${id}`
        );
        setrenovation(teDhenatRenovation.data);
      } catch (e) {
        console.error(e);
      }
    };

    vendosTeDhenat();
  }, [edito]);
  // Edito

  const handleShow = () => {
    setShto(true);
    setPerditeso(Date.now());
  };

  const handleEdito = (id) => {
    setEdito(true);
    setId(id);
  };

  const handleFshij = (id) => {
    setFshij(true);
    setId(id);
  };

  const handleShtoRenovation = async () => {
    await axios
      .post('https://localhost:7251/api/MbrojtjaEProjektit/Renovation/ShtoRenovation', {
        description: description,
        cost: cost,
        buildingID: building
      })
      .then(() => {
        setShto(false);
        setPerditeso(Date.now());
        setDescription('');
        setbuilding('');
        setCost('');
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handlePerditesoRenovation = async () => {
    await axios
      .put(`https://localhost:7251/api/MbrojtjaEProjektit/Renovation/PerditesoRenovation?RenovationID=${id}`, renovation)
      .then(() => {
        setEdito(false);
        setPerditeso(Date.now());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleFshijRenovation = async () => {
    await axios
      .delete(`https://localhost:7251/api/MbrojtjaEProjektit/Renovation/FshijRenovation?RenovationID=${id}`)
      .then(() => {
        setFshij(false);
        setPerditeso(Date.now());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const Test =  async (value) => {
    try {
      const Renovation = await axios.get(`https://localhost:7251/api/MbrojtjaEProjektit/Renovation/ShfaqRenovation`);
      setRenovation(
        Renovation.data.filter((item) => item.buildingID == value).map((k) => ({
          ID: k.renovationID,
          Description: k.description,
          Cost: parseFloat(k.cost) + ' €',
          Building: (k.building && k.building.name) + ' - ' + (k.building && k.building.location)
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {shto && (
        <Modal className="modalEditShto" show={shto} onHide={() => setShto(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Shto Renovation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Descrition</Form.Label>
                <Form.Control
                  onChange={(e) => handledescriptionChange(e.target.value)}
                  value={description}
                  type="text"
                  placeholder="description"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Cost</Form.Label>
                <Form.Control onChange={(e) => handlecostChange(e.target.value)} value={cost} type="number" placeholder="Cost" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Building</Form.Label>
                <select
                  placeholder="Building"
                  className="form-select"
                  value={building}
                  onChange={(e) => handlebuildingChange(e.target.value)}
                >
                  <option defaultValue disabled value="">
                    Zgjedhni Ndertesen
                  </option>
                  {Building &&
                    Building.map((item) => {
                      return (
                        <option key={item.buildingID} value={item.buildingID}>
                          {item.name} - {item.location}
                        </option>
                      );
                    })}
                </select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShto(false)}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={handleShtoRenovation}>
              Shto Renovation
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {edito && (
        <Modal className="modalEditShto" show={edito} onHide={() => setEdito(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edito Renovation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>ID Renovation</Form.Label>
                <Form.Control type="text" value={renovation.renovationID} disabled />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Descripion</Form.Label>
                <Form.Control
                  onChange={(e) => handledescription(e.target.value)}
                  value={renovation.description}
                  type="text"
                  placeholder="Descripion"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Cost</Form.Label>
                <Form.Control onChange={(e) => handlecost(e.target.value)} value={renovation.cost} type="number" placeholder="Cost" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Building</Form.Label>
                <select
                  placeholder="Building"
                  className="form-select"
                  value={renovation.buildingID}
                  onChange={(e) => handlebuilding(e.target.value)}
                >
                  <option selected disabled hidden>
                    {renovation.building && renovation.building.name} - {renovation.building && renovation.building.location}
                  </option>
                  {Building &&
                    Building.map((item) => {
                      return (
                        <option key={item.buildingID} value={item.buildingID}>
                          {item.name} - {item.location}
                        </option>
                      );
                    })}
                </select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEdito(false)}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={handlePerditesoRenovation}>
              Edito Renovation <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {fshij && (
        <Modal show={fshij} onHide={() => setFshij(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'red' }}>Largo Renovation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>A jeni te sigurt qe deshironi ta fshini kete Renovation?</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setFshij(false)}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button variant="danger" onClick={handleFshijRenovation}>
              Largo Renovation <FontAwesomeIcon icon={faBan} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Building</Form.Label>
          <select placeholder="Building" className="form-select" value={building} onChange={(e) => Test(e.target.value)}>
            <option defaultValue disabled value="">
              Zgjedhni Ndertesen
            </option>
            {Building &&
              Building.map((item) => {
                return (
                  <option key={item.buildingID} value={item.buildingID}>
                    {item.name} - {item.location}
                  </option>
                );
              })}
          </select>
        </Form.Group>
        <Tabela
          data={Renovation}
          tabledescription="Lista e Renovation"
          kaButona
          funksionButonShto={() => handleShow()}
          funksionButonEdit={(e) => handleEdito(e)}
          funksionButonFshij={(e) => handleFshij(e)}
        />
      </>
    </div>
  );
}

export default Renovation;
