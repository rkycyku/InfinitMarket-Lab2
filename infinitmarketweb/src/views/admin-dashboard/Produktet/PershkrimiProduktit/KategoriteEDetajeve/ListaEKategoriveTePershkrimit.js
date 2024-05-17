import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import Tabela from '../../../../../components/Tabela/Tabela';
import KontrolloAksesinNeFaqe from '../../../../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from '../../../../../components/Titulli';
import ShtoKategorineEDetajeve from './ShtoKategorineEDetajeve';
import Mesazhi from '../../../../../components/Mesazhi';
import LargoKategorinEdetajeve from './LargoKategorinEdetajeve';
import EditoKategorinEdetajeve from './EditoKategorinEdetajeve';

function ListaEKategoriveTePershkrimit(props) {
    const [kategorite, setKategorite] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shto, setShto] = useState(false);
    const [edito, setEdito] = useState(false);
    const [fshij, setFshij] = useState(false);
    const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
    const [tipiMesazhit, setTipiMesazhit] = useState('');
    const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
    const [id, setId] = useState(0);

    const fetchKategorite = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://localhost:7251/api/Produktet/Produkti/ShfaqKategoriteEDetajet');
            setKategorite(response.data.map(kategoria => ({
                ID: kategoria.kategoriaDetajeveId,
                'Emri i Kategorisë Detajet': kategoria.emriKategoriseDetajeve,
                'Detajet': JSON.parse(kategoria.detajetJson)
            })));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching kategorite:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKategorite();
    }, []);

    const handleClose = () => {
        setShto(false);
        setEdito(false);
        setFshij(false);
    };

    const handleShow = () => {
        setShto(true);
    };

    const handleEdito = (id) => {
        setEdito(true);
        setId(id);
    };

    const handleFshij = (id) => {
        setFshij(true);
        setId(id);
    };

    return (
        <div>
            <KontrolloAksesinNeFaqe vetemAdmin />
            <Titulli titulli={'Lista e Kategorive të Përshkrimit'} />
            {shto && (
                <ShtoKategorineEDetajeve
                    handleClose={handleClose}
                />
            )}
            {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
            {edito && (
                <EditoKategorinEdetajeve
                    handleClose={handleClose}
                    id={id}
                />
            )}
            {fshij && (
                <LargoKategorinEdetajeve
                    handleClose={handleClose}
                    id={id}
                    setTipiMesazhit={setTipiMesazhit}
                    setPershkrimiMesazhit={setPershkrimiMesazhit}
                    perditesoTeDhenat={fetchKategorite}
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
                <>
                    <Tabela
                        data={kategorite}
                        tableName="Lista e Kategorive të Përshkrimit"
                        kaButona={true}
                        funksionButonShto={handleShow}
                        funksionButonFshij={handleFshij}
                        funksionButonEdit={handleEdito}
                    />
                </>
            )}
        </div>
    );
}

export default ListaEKategoriveTePershkrimit;
