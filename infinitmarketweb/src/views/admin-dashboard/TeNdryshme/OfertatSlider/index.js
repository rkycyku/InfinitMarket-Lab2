import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ShtoOfertenSlider from './ShtoOfertenSlider';
import Mesazhi from '../../../../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import LargoOfertenSlider from './LargoOfertenSlider';
import { TailSpin } from 'react-loader-spinner';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';



function OfertatSlider(props) {
  const [kategorit, setKategorit] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shto, setShto] = useState(false);
  const [fshij, setFshij] = useState(false);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqKateogrit = async () => {
      try {
        setLoading(true);
        const kategoria = await axios.get('https://localhost:7251/api/TeNdryshme/OfertatSlider/ShfaqOfertatSlider', authentikimi);
        setKategorit(kategoria.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqKateogrit();
  }, [perditeso]);

  const handleClose = () => {
    setShto(false);
  };
  const handleShow = () => setShto(true);

  const handleFshij = (id) => {
    setFshij(true);
    setId(id);
  };
  

  return (
    <div>
      {shto && (
        <ShtoOfertenSlider
          shfaq={handleShow}
          largo={handleClose}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}

      {fshij && (
        <LargoOfertenSlider
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
          <h1>Ofertat e Sliderit</h1>
          <Link to="/admin/produktet">
            <Button className="mb-3 Butoni">
              Mbyll Ofertat <FontAwesomeIcon icon={faClose} />
            </Button>
          </Link>
          <Button className="mb-3 Butoni" onClick={handleShow}>
            Shto Oferten <FontAwesomeIcon icon={faPlus} />
          </Button>

          <Table responsive>
            <thead>
              <tr>
                <th>ID Oferta</th>
                <th>Linku Ofertes</th>
                <th>Oferta Aktive</th>
                <th>Foto Oferta</th>
                <th>Funksione</th>
              </tr>
            </thead>
            <tbody>
              {kategorit.map((k) => (
                <tr key={k.sliderOfertatID}>
                  <td>{k.sliderOfertatID}</td>
                  <td>{k.linkuOfertes}</td>
                  <td>
                    {new Date(k.dataFillimitOfertes).toLocaleDateString('en-GB', { dateStyle: 'short' })} -{' '}
                    {new Date(k.dataMbarimitOfertes).toLocaleDateString('en-GB', { dateStyle: 'short' })}
                  </td>
                  <td>
                    <img style={{ height: '70px' }} src={process.env.PUBLIC_URL + '/img/ofertat/' + k.fotoOferta} />
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleFshij(k.sliderOfertatID)}>
                      <FontAwesomeIcon icon={faBan} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}

export default OfertatSlider;
