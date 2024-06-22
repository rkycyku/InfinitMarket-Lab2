import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPenToSquare, faPlus, faClose, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Tabela from '../../../components/Tabela/Tabela';

function Employee() {
  const [Employee, setEmployee] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shto, setShto] = useState(false);
  const [edito, setEdito] = useState(false);
  const [fshij, setFshij] = useState(false);
  const [id, setId] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const shfaqEmployee = async () => {
      try {
        const employee = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Employee/ShfaqEmployee');
        setEmployee(
          employee.data.map((k) => ({
            ID: k.employeeId,
            'Full Name': k.fullName,
            IsActive: k.isActive
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };

    shfaqEmployee();
  }, [perditeso]);

  // SHTO
  const [name, setName] = useState('');
  const handleNameChange = (value) => {
    setName(value);
  };
  // SHTO

  // Edito
  const [Employeei, setEmployeei] = useState([]);

  const handleName = (value) => {
    setEmployeei((prev) => ({ ...prev, fullName: value }));
  };

  const handleType = (value) => {
    setEmployeei((prev) => ({ ...prev, isActive: value }));
  };

  useEffect(() => {
    const vendosTeDhenat = async () => {
      try {
        const teDhenatEmployeei = await axios.get(
          `https://localhost:7251/api/MbrojtjaEProjektit/Employee/ShfaqEmployeeNgaID?EmployeeId=${id}`
        );
        setEmployeei(teDhenatEmployeei.data);
      } catch (e) {
        console.error(e);
      }
    };

    vendosTeDhenat();
  }, [edito]);
  // Edito

  const handleShow = () => setShto(true);

  const handleEdito = (id) => {
    setEdito(true);
    setId(id);
  };

  const handleFshij = (id) => {
    setFshij(true);
    setId(id);
  };

  const handleShtoEmployeein = async () => {
    await axios
      .post('https://localhost:7251/api/MbrojtjaEProjektit/Employee/ShtoEmployee', {
        fullName: name
      })
      .then(() => {
        setShto(false);
        setName('');
        setPerditeso(Date.now());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handlePerditesoEmployeein = async () => {
    await axios
      .put(`https://localhost:7251/api/MbrojtjaEProjektit/Employee/PerditesoEmployee?EmployeeId=${id}`, Employeei)
      .then(() => {
        setEdito(false);
        setPerditeso(Date.now());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleFshijEmployeein = async () => {
    await axios
      .delete(`https://localhost:7251/api/MbrojtjaEProjektit/Employee/FshijEmployee?EmployeeId=${id}`)
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
            <Modal.Title>Shto Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>
                  Full Name<span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  onChange={(e) => handleNameChange(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShto(false)}>
              Close <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={handleShtoEmployeein}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {edito && (
        <Modal className="modalEditShto" show={edito} onHide={() => setEdito(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edito Employeein</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>ID Employee</Form.Label>
                <Form.Control type="text" value={Employeei.employeeId} disabled />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  onChange={(e) => handleName(e.target.value)}
                  value={Employeei.fullName}
                  type="text"
                  placeholder="Emri Employeeit"
                  autoFocus
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>IsActive</Form.Label>
                <select
                  placeholder="IsActive"
                  className="form-select"
                  value={Employeei.isActive}
                  onChange={(e) => handleType(e.target.value)}
                >
                  <option key="true" value="true">
                    true
                  </option>
                  <option key="false" value="false">
                    false
                  </option>
                </select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEdito(false)}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={handlePerditesoEmployeein}>
              Edito Employee <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {fshij && (
        <Modal show={fshij} onHide={() => setFshij(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'red' }}>Largo Employeein</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>A jeni te sigurt qe deshironi ta fshini kete Employee?</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setFshij(false)}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button variant="danger" onClick={handleFshijEmployeein}>
              Largo Employeein <FontAwesomeIcon icon={faBan} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <>
        <>
          <Tabela
            data={Employee}
            tableName="Lista e Employee"
            kaButona
            funksionButonShto={() => handleShow()}
            funksionButonEdit={(e) => handleEdito(e)}
            funksionButonFshij={(e) => handleFshij(e)}
          />
        </>
      </>
    </div>
  );
}

export default Employee;
