import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import exportFromJSON from 'export-from-json';
import { faCss3Alt, faHtml5 } from '@fortawesome/free-brands-svg-icons';
import { faFileCode, faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function EksportoTeDhenat(props) {
  const [eksportoTeDhenat, setEksportoTeDhenat] = useState(false);

  function EksportoTeDhenat(llojiDokumentit) {
    const fileName = props.emriDokumentit;
    let format;
    switch (llojiDokumentit) {
      case 'css':
        format = exportFromJSON.types.css;
        break;
      case 'csv':
        format = exportFromJSON.types.csv;
        break;
      case 'html':
        format = exportFromJSON.types.html;
        break;
      case 'json':
        format = exportFromJSON.types.json;
        break;
      case 'txt':
        format = exportFromJSON.types.txt;
        break;
      case 'xls':
        format = exportFromJSON.types.xls;
        break;
      case 'xml':
        format = exportFromJSON.types.xml;
        break;
      default:
        console.error('Invalid export type');
        return;
    }

    exportFromJSON({ data: props.teDhenatJSON, fileName: fileName, exportType: format });
  }

  return (
    <div>
      {eksportoTeDhenat && (
        <Modal show={eksportoTeDhenat}>
          <Modal.Header>
            <Modal.Title>Eksporto te dhenat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => EksportoTeDhenat('css')}>
              CSS <FontAwesomeIcon icon={faCss3Alt} />
            </Button>
            <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => EksportoTeDhenat('csv')}>
              CSV <FontAwesomeIcon icon={faFileCsv} />
            </Button>
            <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => EksportoTeDhenat('html')}>
              HTML <FontAwesomeIcon icon={faHtml5} />
            </Button>
            <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => EksportoTeDhenat('json')}>
              JSON <FontAwesomeIcon icon={faFileCode} />
            </Button>
            <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => EksportoTeDhenat('txt')}>
              TXT <FontAwesomeIcon icon={faFileCode} />
            </Button>
            <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => EksportoTeDhenat('xls')}>
              EXCEL <FontAwesomeIcon icon={faFileExcel} />
            </Button>
            <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => EksportoTeDhenat('xml')}>
              XML <FontAwesomeIcon icon={faFileCode} />
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setEksportoTeDhenat(false)} variant={'outline-success'}>
              Mbylle
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Button variant="success" onClick={() => setEksportoTeDhenat(true)}>
        Eksporto te Dhenat
      </Button>
    </div>
  );
}

export default EksportoTeDhenat;
