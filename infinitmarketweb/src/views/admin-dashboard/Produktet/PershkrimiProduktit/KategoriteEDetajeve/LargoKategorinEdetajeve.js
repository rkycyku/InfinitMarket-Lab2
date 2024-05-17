import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faTimes } from '@fortawesome/free-solid-svg-icons';
import KontrolloAksesinNeFunksione from "../../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione";

function LargoKategorinEdetajeve(props) {
    const getToken = localStorage.getItem("token");

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${getToken}`,
        },
    };

    async function handleSubmit() {
        try {
            await axios.delete(`https://localhost:7251/api/Produktet/Produkti/FshijKategorineEDetajet/${props.id}`, authHeaders);
            props.setTipiMesazhit("success");
            props.setPershkrimiMesazhit("Kategoria e detajeve u fshi me sukses!");
            props.perditesoTeDhenat();
            props.handleClose();
            props.shfaqmesazhin();
        } catch (error) {
            console.error(error);
            props.setTipiMesazhit("danger");
            props.setPershkrimiMesazhit("Ndodhi nje gabim gjate fshirjes se kategorise se detajeve!");
            props.perditesoTeDhenat();
            props.shfaqmesazhin();
        }
    }

    return (
        <>
            <KontrolloAksesinNeFunksione
                handleClose={() => props.handleClose()}
                shfaqmesazhin={() => props.shfaqmesazhin()}
                perditesoTeDhenat={() => props.perditesoTeDhenat()}
                setTipiMesazhit={(e) => props.setTipiMesazhit(e)}
                setPershkrimiMesazhit={(e) => props.setPershkrimiMesazhit(e)}
            />
            <Modal show={true} onHide={() => props.handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "red" }}>Largo Kategorinë e Detajeve</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>A jeni të sigurt që dëshironi të fshini këtë kategori të detajeve?</h6>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => props.handleClose()}>
                        Anulo <FontAwesomeIcon icon={faTimes} />
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleSubmit}
                    >
                        Largo Kategorinë e Detajeve <FontAwesomeIcon icon={faBan} />
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LargoKategorinEdetajeve;
