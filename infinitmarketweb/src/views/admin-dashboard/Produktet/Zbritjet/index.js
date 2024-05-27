import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ProduktiNeZbritje from './ProduktiNeZbritje';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import Mesazhi from '../../../../components/Mesazhi';
import FshijZbritjen from './FshijZbritjen';
import Tabela from '../../../../components/Tabela/Tabela';
import KontrolloAksesinNeFaqe from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from '../../../../components/Titulli';

function ZbritjetEProduktit(props) {
  const [zbritjet, setZbritjet] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shtoZbritjen, setShtoZbritjen] = useState(false);
  const [mbyllFature, setMbyllFaturen] = useState(true);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [fshij, setFshij] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqZbritjet = async () => {
      try {
        setLoading(true);
        const zbritja = await axios.get('https://localhost:7251/api/Produktet/ZbritjaQmimitProduktit/shfaqZbritjet', authentikimi);
        setZbritjet(
          zbritja.data.map((z) => ({
            ID: z.zbritjaID,
            'ID dhe Emri Produktit': z.produktiId + ' - ' + z.emriProduktit,
            'Qmim pa Zbritje €': parseFloat(z.qmimiPaZbritjeProduktit).toFixed(2) + ' €',
            'Qmimi me Zbritje €': parseFloat(z.qmimiMeZbritjeProduktit).toFixed(2) + ' €',
            'Data e Zbritjes': new Date(z.dataZbritjes).toLocaleDateString('en-GB', { dateStyle: 'short' }),
            'Data e Skadimit': new Date(z.dataSkadimit).toLocaleDateString('en-GB', { dateStyle: 'short' })
          }))
        );
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqZbritjet();
  }, [perditeso]);

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString('en-GB', { dateStyle: 'short' });
    zbritjet.forEach((zbritja) => {
      const dataSkadimit = new Date(zbritja.dataSkadimit).toLocaleDateString('en-GB', { dateStyle: 'short' });
      if (dataSkadimit < currentDate) {
        fshijZbritjen(zbritja.produktiId);
      }
    });
  }, [zbritjet]);

  const fshijZbritjen = (id) => {
    axios.delete(`https://localhost:7251/api/Produktet/ZbritjaQmimitProduktit/fshijZbritjenProduktit?id=${id}`, authentikimi);
    setPerditeso(Date.now());
  };

  const handleFshij = (id) => {
    setFshij(true);
    setId(id);
  };
  const handleFshijMbyll = () => setFshij(false);

  return (
    <div>
      <KontrolloAksesinNeFaqe vetemAdmin/>
      <Titulli titulli={'Zbritjet e Produkteve'} />
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {fshij && (
        <FshijZbritjen
          largo={handleFshijMbyll}
          fshijZbritjen={() => fshijZbritjen(id)}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
          setPerditeso={() => setPerditeso(Date.now())}
        />
      )}
      {shtoZbritjen && (
        <ProduktiNeZbritje
          mbyllZbritjen={() => setShtoZbritjen(false)}
          shfaq={() => setShtoZbritjen(true)}
          setPerditeso={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
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
        mbyllFature && (
          <>
            <Tabela
              data={zbritjet}
              tableName="Zbritjet e Produkteve"
              kaButona
              funksionButonShto={() => setShtoZbritjen(true)}
              funksionButonFshij={(e) => handleFshij(e)}
            />
          </>
        )
      )}
    </div>
  );
}

export default ZbritjetEProduktit;
