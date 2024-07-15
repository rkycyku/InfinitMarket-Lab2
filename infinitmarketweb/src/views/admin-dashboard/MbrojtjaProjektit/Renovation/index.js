import { useEffect, useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import Tabela from '../../../../components/Tabela/Tabela';
import Mesazhi from '../../../../components/Mesazhi';
import ShtoRenovation from './ShtoRenovation';
import EditoRenovation from './EditoRenovation';
import LargoRenovation from './LargoRenovation';
import KontrolloAksesinNeFaqe from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from './../../../../components/Titulli';
import { Button, Dropdown, DropdownButton, Form, InputGroup } from 'react-bootstrap';

function Renovation(props) {
  const [renovation, setRenovation] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [loading, setLoading] = useState(false);

  const [building, setBuilding] = useState('');

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqRenovation = async () => {
      try {
        setLoading(true);
        const renovation = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Renovation/shfaqRenovation', authentikimi);
        setRenovation(
          renovation.data.map((k) => ({
            ID: k.renovationID,
            Description: k.description,
            Cost: parseFloat(k.cost) + ' €',
            Building: (k.building && k.building.name) + ' - ' + (k.building && k.building.location)
          }))
        );
        const building = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Building/ShfaqBuilding', authentikimi);
        setBuilding(building.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqRenovation();
  }, [perditeso]);

  const [shto, setShto] = useState(false);
  const [edito, setEdito] = useState(false);
  const [fshij, setFshij] = useState(false);
  const [id, setId] = useState(0);

  const handleClose = () => {
    setShto(false);
  };
  const handleShow = () => setShto(true);

  const handleEdito = (id) => {
    setEdito(true);
    setId(id);
  };
  const handleEditoMbyll = () => setEdito(false);

  const handleFshij = (id) => {
    setFshij(true);
    setId(id);
  };
  const handleFshijMbyll = () => setFshij(false);

  const handleKerkoNgaIDPrimare = async (buildingID) => {
    try {
      const Renovation = await axios.get(`https://localhost:7251/api/MbrojtjaEProjektit/Renovation/ShfaqRenovation`, authentikimi);
      console.log(buildingID);
      setRenovation(
        Renovation.data
          .filter((item) => item.buildingID == buildingID)
          .map((k) => ({
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
      <KontrolloAksesinNeFaqe vetemAdmin />
      <Titulli titulli={'Renovation'} />
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {shto && (
        <ShtoRenovation
          shfaq={handleShow}
          largo={handleClose}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {edito && (
        <EditoRenovation
          largo={handleEditoMbyll}
          id={id}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {fshij && (
        <LargoRenovation
          largo={handleFshijMbyll}
          id={id}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {loading ? (
        <div className="Loader">
          <TailSpin
            height="80"
            width="80"
            color="#009879"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <>
          <InputGroup className="mb-3">
            <DropdownButton
              variant="outline-secondary"
              title="Zgjedhni Ndertesen"
              id="input-group-dropdown-2"
              align="end"
              onSelect={handleKerkoNgaIDPrimare}
            >
              {building &&
                building.map((item) => {
                  return (
                    <Dropdown.Item key={item.buildingID} eventKey={item.buildingID}>
                      {item.name} - {item.location}
                    </Dropdown.Item>
                  );
                })}
            </DropdownButton>
            <Button variant="outline-secondary" onClick={() => setPerditeso(Date.now())}>
              Pastro Filtrat
            </Button>
          </InputGroup>

          <Tabela
            data={renovation}
            tableName="Lista e Renovation"
            kaButona
            funksionButonEdit={(e) => handleEdito(e)}
            funksionButonShto={() => handleShow()}
            funksionButonFshij={(e) => handleFshij(e)}
          />
        </>
      )}
    </div>
  );
}

export default Renovation;
