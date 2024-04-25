import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faClose } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import PagesaMeSukses from '../../components/Checkout/PagesaMeSukses';
import EksportoTeDhenat from '../../components/EksportoTeDhenat';

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
        const porosija = await axios.get(
          `https://localhost:7251/api/TeNdryshme/Porosia/ShfaqPorositeKlientit?idPerdoruesi=${getID}`,
          authentikimi
        );
        setPorosite(porosija.data);
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

  function PergatitjaTeDhenavePerEksport() {
    return porosite.map((user) => {
      const { idPorosia, totaliProdukteve, totali8TVSH, totali18TVSH, zbritja, dataPorosis, statusiPorosis, qmimiTransportit } = user;

      return {
        'ID Porosia': idPorosia,
        'Totali Produkteve': totaliProdukteve,
        'Totali €': parseFloat(totali8TVSH + totali18TVSH - zbritja + parseFloat(qmimiTransportit)).toFixed(2),
        'Zbritja €': zbritja !== 0 ? parseFloat(zbritja).toFixed(2) : 'Nuk Ka Zbritje',
        'Data e Porosise': new Date(dataPorosis).toLocaleDateString('en-GB', { dateStyle: 'short' }),
        'Statusi Porosis': statusiPorosis
      };
    });
  }

  return (
    <div>
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
            <>
              <h1 className="title">Porosit e Juaja</h1>
              <Button className="mb-3 Butoni" onClick={() => navigate('/Dashboard')}>
                Mbyll Porosite <FontAwesomeIcon icon={faClose} />
              </Button>
              <EksportoTeDhenat teDhenatJSON={PergatitjaTeDhenavePerEksport()} emriDokumentit="Porosit e Juaja" />

              <Table>
                <thead>
                  <tr>
                    <th>ID Porosise</th>
                    <th>Data Porosise</th>
                    <th>Totali Produkteve ne Porosi</th>
                    <th>Totali Porosise €</th>
                    <th>Zbritja €</th>
                    <th>Statusi Porosise</th>
                    <th>Funksione</th>
                  </tr>
                </thead>
                <tbody>
                  {porosite.map((k) => (
                    <tr key={k.idPorosia}>
                      <td>{k.idPorosia}</td>
                      <td>{new Date(k.dataPorosis).toLocaleDateString('en-GB', { dateStyle: 'short' })}</td>
                      <td>{k.totaliProdukteve}</td>
                      <td>{parseFloat(k.totali8TVSH + k.totali18TVSH - k.zbritja + parseFloat(k.qmimiTransportit)).toFixed(2)} €</td>
                      <td>{k.zbritja !== 0 ? parseFloat(k.zbritja).toFixed(2) + ' €' : 'Nuk Ka Zbritje'}</td>
                      <td>{k.statusiPorosis}</td>
                      <td>
                        <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => handleShfaqFaturen(k.idPorosia)}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PorositeUserit;
