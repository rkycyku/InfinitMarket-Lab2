import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPenToSquare, faPlus, faClose, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Tabela from '../../../components/Tabela/Tabela';

function Contract() {
  const [Contract, setContract] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shto, setShto] = useState(false);
  const [edito, setEdito] = useState(false);
  const [fshij, setFshij] = useState(false);
  const [id, setId] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const shfaqContract = async () => {
      try {
        const Contract = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Contract/ShfaqContract');
        setContract(
          Contract.data.map((k) => ({
            ID: k.contractID,
            Name: k.name,
            'Start Date': new Date(k.startDate).toLocaleDateString('en-GB', { dateStyle: 'short' }),
            Employee: k.employee && k.employee.fullName
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };

    shfaqContract();
  }, [perditeso]);

  // SHTO
  const [Employee, setEmployee] = useState([]);

  useEffect(() => {
    const shfaqEmployee = async () => {
      try {
        const Employee = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Employee/ShfaqEmployee');
        setEmployee(Employee.data);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqEmployee();
  }, [perditeso]);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [employee, setemployee] = useState('');

  const handleNameChange = (value) => {
    setName(value);
  };
  const handleStartDateChange = (value) => {
    setStartDate(value);
  };
  const handleEmployeeChange = (value) => {
    setemployee(value);
  };
  // SHTO

  // Edito
  const [sateliti, setSateliti] = useState([]);

  const handleName = (value) => {
    setSateliti((prev) => ({ ...prev, name: value }));
  };
  const handleStartDate = (value) => {
    setSateliti((prev) => ({ ...prev, startDate: value }));
  };
  const handleEmployee = (value) => {
    setSateliti((prev) => ({ ...prev, employeeId: value }));
  };

  useEffect(() => {
    const vendosTeDhenat = async () => {
      try {
        const teDhenatContract = await axios.get(
          `https://localhost:7251/api/MbrojtjaEProjektit/Contract/ShfaqContractNgaID?ContractID=${id}`
        );
        setSateliti(teDhenatContract.data);
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

  const handleShtoContract = async () => {
    await axios
      .post('https://localhost:7251/api/MbrojtjaEProjektit/Contract/ShtoContract', {
        name: name,
        startDate: startDate,
        employeeId: employee
      })
      .then(() => {
        setShto(false);
        setPerditeso(Date.now());
        setName('');
        setemployee('');
        setStartDate('');
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handlePerditesoContract = async () => {
    await axios
      .put(`https://localhost:7251/api/MbrojtjaEProjektit/Contract/PerditesoContract?ContractID=${id}`, sateliti)
      .then(() => {
        setEdito(false);
        setPerditeso(Date.now());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleFshijContract = async () => {
    await axios
      .delete(`https://localhost:7251/api/MbrojtjaEProjektit/Contract/FshijContract?ContractID=${id}`)
      .then(() => {
        setFshij(false);
        setPerditeso(Date.now());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      {shto && (
        <Modal className="modalEditShto" show={shto} onHide={() => setShto(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Shto Contract</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={(e) => handleNameChange(e.target.value)} value={name} type="text" placeholder="Name" autoFocus />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  value={startDate}
                  type="date"
                  placeholder="Start Date"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Employee</Form.Label>
                <select
                  placeholder="Employee"
                  className="form-select"
                  value={employee}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                >
                  <option defaultValue disabled value="">
                    Zgjedhni Employee
                  </option>
                  {Employee.map((item) => {
                    return (
                      <option key={item.employeeId} value={item.employeeId}>
                        {item.fullName}
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
            <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={handleShtoContract}>
              Shto Contract
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {edito && (
        <Modal className="modalEditShto" show={edito} onHide={() => setEdito(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edito Contract</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>ID Contract</Form.Label>
                <Form.Control type="text" value={sateliti.contractID} disabled />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={(e) => handleName(e.target.value)} value={sateliti.name} type="text" placeholder="Name" autoFocus />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Start Date</Form.Label>
                <Form.Control onChange={(e) => handleStartDate(e.target.value)} value={sateliti.startDate} type="date" placeholder="Start Date"/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Emplouee</Form.Label>
                <select
                  placeholder="Emplouee"
                  className="form-select"
                  value={sateliti.employeeId}
                  onChange={(e) => handleEmployee(e.target.value)}
                >
                  <option selected disabled hidden>
                    {sateliti.employee && sateliti.employee.fullName}
                  </option>
                  {Employee.map((item) => {
                    return (
                      <option key={item.employeeId} value={item.employeeId}>
                        {item.fullName}
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
            <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={handlePerditesoContract}>
              Edito Contract <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {fshij && (
        <Modal show={fshij} onHide={() => setFshij(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'red' }}>Largo Contract</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>A jeni te sigurt qe deshironi ta fshini kete Satelit?</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setFshij(false)}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button variant="danger" onClick={handleFshijContract}>
              Largo Contract <FontAwesomeIcon icon={faBan} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <>
        <Tabela
          data={Contract}
          tableName="Lista e Contract"
          kaButona
          funksionButonShto={() => handleShow()}
          funksionButonEdit={(e) => handleEdito(e)}
          funksionButonFshij={(e) => handleFshij(e)}
        />
      </>
    </div>
  );
}

export default Contract;
