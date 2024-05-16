import { useEffect, useState } from 'react';
import axios from 'axios';
import ShtoOfertenSlider from './ShtoOfertenSlider';
import Mesazhi from '../../../../components/Mesazhi';
import LargoOfertenSlider from './LargoOfertenSlider';
import { TailSpin } from 'react-loader-spinner';
import Tabela from '../../../../components/Tabela/Tabela';
import KontrolloAksesinNeFaqe from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from '../../../../components/Titulli';

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
        setKategorit(
          kategoria.data.map((k) => ({
            ID: k.sliderOfertatID,
            'Linku Ofertes': k.linkuOfertes,
            'Oferta Aktive':
              new Date(k.dataFillimitOfertes).toLocaleDateString('en-GB', { dateStyle: 'short' }) +
              ' - ' +
              new Date(k.dataMbarimitOfertes).toLocaleDateString('en-GB', { dateStyle: 'short' }),
            'Foto Oferta': '<img style="height: 70px;" src="' + process.env.PUBLIC_URL + '/img/ofertat/' + k.fotoOferta + '" />'
          }))
        );

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
      <KontrolloAksesinNeFaqe vetemAdmin />
      <Titulli titulli={'Ofertat e Sliderit'} />
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
          largo={() => setFshij(false)}
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
            tableName="Ofertat e Sliderit"
            kaButona
            funksionButonShto={() => handleShow()}
            funksionButonFshij={(e) => handleFshij(e)}
          />
        </>
      )}
    </div>
  );
}

export default OfertatSlider;
