import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faClose } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import PagesaMeSukses from '../../components/Checkout/PagesaMeSukses';
import EksportoTeDhenat from '../../components/Tabela/EksportoTeDhenat';
import Tabela from '../../components/Tabela/Tabela';
import Titulli from '../../components/Titulli';

function PorositeUserit(props) {
  const [porosite, setPorosite] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [loading, setLoading] = useState(false);

  const [shfaqPorosite, setShfaqPorosite] = useState(true);
  const [shfaqDetajet, setShfaqDetajet] = useState(false);
  const [nrFatures, setNumriFatures] = useState(0);

  const navigate = useNavigate();

  const getToken = localStorage.getItem('token');
  const getID = localStorage.getItem('id');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const vendosPorosite = async () => {
      try {
        setLoading(true);
        const porosia = await axios.get(`https://localhost:7251/api/TeNdryshme/Porosia/ShfaqPorositeKlientit?idPerdoruesi=${getID}`, authentikimi);
        setPorosite(
          porosia.data.map((k) => ({
            ID: k.idPorosia,
            'Data e Porosise': new Date(k.dataPorosis).toLocaleDateString('en-GB', { dateStyle: 'short' }),
            'Totali Produkteve ne Porosi': k.totaliProdukteve,
            'Totali Porosise €': parseFloat(k.totali8TVSH + k.totali18TVSH - k.zbritja + parseFloat(k.qmimiTransportit)).toFixed(2) + ' €',
            'Zbritja €': k.zbritja !== 0 ? parseFloat(k.zbritja).toFixed(2) + ' €' : 'Nuk Ka Zbritje',
            'Statusi Porosis': k.statusiPorosis
          }))
        );
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    vendosPorosite();
  }, [perditeso]);

  const handleShfaqFaturen = (nrFatures) => {
    setShfaqPorosite(false);
    setNumriFatures(nrFatures);
    setShfaqDetajet(true);
  };

  return (
    <div>
      <Titulli titulli={'Porosite e Juaja'} />
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
          {shfaqDetajet && (
            <PagesaMeSukses
              handleMbyll={() => {
                setShfaqDetajet(false);
                setShfaqPorosite(true);
              }}
              nrFatures={nrFatures}
            />
          )}
          {shfaqPorosite && (
            <Tabela data={porosite} tableName="Porosite e Juaja" kaButona funksionShfaqFature={(e) => handleShfaqFaturen(e)} />
          )}
        </>
      )}
    </div>
  );
}

export default PorositeUserit;
