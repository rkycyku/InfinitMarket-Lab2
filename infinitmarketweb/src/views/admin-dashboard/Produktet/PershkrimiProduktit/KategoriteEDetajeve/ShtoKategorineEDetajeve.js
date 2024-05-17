import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const ShtoKategorineEDetajeve = ({ handleClose }) => {
  const [inputs, setInputs] = useState({});
  const [emri, setEmri] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddInput = () => {
    setInputs({
      ...inputs,
      [`input${Object.keys(inputs).length + 1}`]: ''
    });
  };

  const handleDeleteInput = (key) => {
    const { [key]: valueToRemove, ...rest } = inputs;
    setInputs(rest);
  };

  const handleChangeInput = (key, value) => {
    setInputs({
      ...inputs,
      [key]: value
    });
  };

  const handleCancel = () => {
    handleClose();
    setEmri('');
    setInputs({});
    setError('');
  };

  const handleSendData = async () => {
    if (emri.trim() === '' || Object.values(inputs).some(input => input.trim() === '')) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formattedInputs = {};
      Object.entries(inputs).forEach(([key, value]) => {
        formattedInputs[value] = '';
      });

      const data = {
        emriKategoriseDetajeve: emri,
        detajetJson: JSON.stringify(formattedInputs),
      };

      const response = await axios.post('https://localhost:7251/api/Produktet/Produkti/ShtoKategorineEDetajet', data);

      console.log('Response from API:', response.data);
      
    } catch (error) {
      console.error('Error sending data:', error);
    }

    setLoading(false);
    handleClose();
  };

  return (
    <Modal className="modalEditShto" show={true} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Shto Kategorine</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="emriKategoriseDetajeve">
            <Form.Label>
              Emri Kategorise Detajeve <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Emri Kategorise Detajeve"
              value={emri}
              onChange={(e) => setEmri(e.target.value)}
            />
          </Form.Group>
          {Object.entries(inputs).map(([key, value], index) => (
            <Form.Group key={index} controlId={`input-${index}`}>
              <Form.Label>{`Input ${index + 1}`}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Input ${index + 1}`}
                value={value}
                onChange={(e) => handleChangeInput(key, e.target.value)}
              />
              <Button onClick={() => handleDeleteInput(key)}>Delete</Button>
            </Form.Group>
          ))}
          <Button onClick={handleAddInput}>Add Input</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel <FontAwesomeIcon icon={faTimes} />
        </Button>
        <Button onClick={handleSendData} disabled={loading}>
          {loading ? 'Sending...' : 'Save Changes'} <FontAwesomeIcon icon={faPlus} />
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Modal.Footer>
    </Modal>
  );
};

export default ShtoKategorineEDetajeve;
