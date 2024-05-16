import { useEffect, useState } from 'react';
import axios from 'axios';
import Mesazhi from '../../../components/Mesazhi';
import { TailSpin } from 'react-loader-spinner';
import Tabela from '../../../components/Tabela/Tabela';
import KontrolloAksesinNeFaqe from '../../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from './../../../components/Titulli';

function ShportaEKlienteve(props) {
  const [klientet, setKlientet] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [loading, setLoading] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqKlientet = async () => {
      try {
        setLoading(true);
        const klientet = await axios.get('https://localhost:7251/api/Produktet/Shporta/ShfaqShportatEKlienteve', authentikimi);
        setKlientet(
          klientet.data.map((k) => ({
            ID: k.shportaID,
            Klienti: k.perdoruesi.emri + ' ' + k.perdoruesi.mbiemri,
            Email: k.perdoruesi.email,
            'Totali produkteve ne shporte': k.totaliProdukteveNeShporte,
            'Totali Shportes €': parseFloat(k.totali18TVSH + k.totali8TVSH).toFixed(2) + ' €',
            'Kodi Zbritjes': k.kodiZbritjes.kodi + ' - ' + parseFloat(k.kodiZbritjes.qmimiZbritjes).toFixed(2) + ' €'
          }))
        );
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqKlientet();
  }, [perditeso]);

  return (
    <div>
      <KontrolloAksesinNeFaqe />
      <Titulli titulli={'Shporta e Klienteve'} />
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
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
        <Tabela data={klientet} tableName="Shporta e Klienteve" />
      )}
    </div>
  );
}

export default ShportaEKlienteve;
