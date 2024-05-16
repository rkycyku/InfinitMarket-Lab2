import { useEffect, useState } from 'react';
import axios from 'axios';
import ShtoKategori from './ShtoKategori';
import Mesazhi from '../../../../components/Mesazhi';
import EditoKategorin from './EditoKategorin';
import LargoKategorin from './LargoKategorin';
import { TailSpin } from 'react-loader-spinner';
import Tabela from '../../../../components/Tabela/Tabela';
import KontrolloAksesinNeFaqe from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from '../../../../components/Titulli';

function TabelaEKategorive(props) {
  const [kategorit, setKategorit] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shto, setShto] = useState(false);
  const [edito, setEdito] = useState(false);
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
        const kategoria = await axios.get('https://localhost:7251/api/Produktet/Kategoria/shfaqKategorit', authentikimi);
        setKategorit(kategoria.data.map((k) => ({
          ID: k.kategoriaId,
          'Emri Kategoris': k.llojiKategoris,
          "Pershkrimi Kategoris": k.pershkrimiKategoris !== null && k.pershkrimiKategoris.trim() !== '' ? k.pershkrimiKategoris : 'Nuk Ka Pershkrim'
        })));
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

  return (
    <div>
      <KontrolloAksesinNeFaqe vetemAdmin/>
      <Titulli titulli={'Kategorite e Produktit'} />
      {shto && (
        <ShtoKategori
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
        <EditoKategorin
          largo={handleEditoMbyll}
          id={id}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {fshij && (
        <LargoKategorin
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
            <Tabela
              data={kategorit}
              tableName="Lista e Kategorive te Produkteve"
              kaButona
              funksionButonShto={() => handleShow()}
              funksionButonFshij={(e) => handleFshij(e)}
              funksionButonEdit={(e) => handleEdito(e)}
            />
        </>
      )}
    </div>
  );
}

export default TabelaEKategorive;
