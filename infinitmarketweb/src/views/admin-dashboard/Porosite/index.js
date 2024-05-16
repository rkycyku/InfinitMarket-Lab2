import { useEffect, useState } from 'react';
import axios from 'axios';
import Mesazhi from '../../../components/Mesazhi';
import PerditesoStatusinPorosis from './PerditesoStatusinPorosis';
import { TailSpin } from 'react-loader-spinner';
import PagesaMeSukses from '../../../components/Checkout/PagesaMeSukses';
import 'react-datepicker/dist/react-datepicker.css';
import './Styles/TabelaEPorosive.css';
import Tabela from '../../../components/Tabela/Tabela';
import KontrolloAksesinNeFaqe from '../../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from './../../../components/Titulli';

function TabelaEPorosive() {
  const [porosite, setPorosite] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [edito, setEdito] = useState(false);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shfaqPorosite, setShfaqPorosite] = useState(true);
  const [shfaqDetajet, setShfaqDetajet] = useState(false);
  const [nrFatures, setNumriFatures] = useState(0);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const vendosPorosite = async () => {
      try {
        setLoading(true);
        const porosia = await axios.get('https://localhost:7251/api/TeNdryshme/Porosia/ShfaqPorosit', authentikimi);
        setPorosite(
          porosia.data.map((k) => ({
            ID: k.idPorosia,
            Klienti: k.idKlienti + ' - ' + k.emri + ' ' + k.mbiemri,
            'Totali Produkteve': k.totaliProdukteve,
            'Totali €': parseFloat(k.totali8TVSH + k.totali18TVSH).toFixed(2) + ' €',
            'Totali pa TVSH €':
              parseFloat(k.totali8TVSH + k.totali18TVSH - (k.totali18TVSH * 0.152542 + k.totali8TVSH * 0.074074)).toFixed(2) + ' €',
            'TVSH €': parseFloat(k.totali18TVSH * 0.152542 + k.totali8TVSH * 0.074074).toFixed(2) + ' €',
            'Zbritja €': parseFloat(k.zbritja).toFixed(2) + ' €',
            'Data e Porosise': new Date(k.dataPorosis).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
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

  const handleEdito = (id) => {
    setEdito(true);
    setId(id);
  };
  const handleEditoMbyll = () => setEdito(false);

  const handleShfaqFaturen = (nrFatures) => {
    setShfaqPorosite(false);
    setNumriFatures(nrFatures);
    setShfaqDetajet(true);
  };

  return (
    <div>
      <KontrolloAksesinNeFaqe />
      <Titulli titulli={'Porosite e Klienteve'} />
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {edito && (
        <PerditesoStatusinPorosis
          largo={handleEditoMbyll}
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
              <Tabela
                data={porosite}
                tableName="Porosite e Klienteve"
                kaButona
                funksionButonEdit={(e) => handleEdito(e)}
                funksionShfaqFature={(e) => handleShfaqFaturen(e)}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default TabelaEPorosive;
