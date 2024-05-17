import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const EditoKategorinEdetajeve = ({ handleClose, id }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedDetails, setEditedDetails] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://localhost:7251/api/Produktet/Produkti/ShfaqKategorineEDetajet/${id}`);
            if (response.data) {
                setSelectedCategory(response.data);
                setEditedName(response.data.emriKategoriseDetajeve);
                setEditedDetails(JSON.parse(response.data.detajetJson));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch category data.');
        }
    };

    const handleNameChange = (event) => {
        setEditedName(event.target.value);
    };

    const handleDetailChange = (oldKey, newKey) => {
        setEditedDetails(prevDetails => {
            const updatedDetails = { ...prevDetails };
            const value = updatedDetails[oldKey];
            delete updatedDetails[oldKey];
            updatedDetails[newKey] = value;
            return updatedDetails;
        });
    };

    const handleAddDetail = () => {
        const newKey = `detail${Object.keys(editedDetails).length + 1}`;
        setEditedDetails(prevState => ({
            ...prevState,
            [newKey]: ''
        }));
    };

    const handleDeleteDetail = (key) => {
        const { [key]: valueToRemove, ...rest } = editedDetails;
        setEditedDetails(rest);
    };

    const handleCancel = () => {
        handleClose();
        resetForm();
    };

    const resetForm = () => {
        setEditedName('');
        setEditedDetails({});
        setError('');
    };

    const handleUpdate = async () => {
        if (!selectedCategory) {
            setError('Please select a category.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = {
                emriKategoriseDetajeve: editedName,
                detajetJson: JSON.stringify(editedDetails)
            };

            await axios.put(`https://localhost:7251/api/Produktet/Produkti/PerditesoKategorineEDetajet/${selectedCategory.kategoriaDetajeveId}`, data);
            alert('Category updated successfully');
            handleClose();
            resetForm();
        } catch (error) {
            console.error('Error updating category:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Failed to update category.');
            } else {
                setError('Failed to update category.');
            }
        }

        setLoading(false);
    };

    return (
        <Modal show={true} onHide={handleCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="editCategoryName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control type="text" value={editedName} onChange={handleNameChange} />
                    </Form.Group>
                    {Object.entries(editedDetails).map(([key, value], index) => (
                        <Form.Group key={index} controlId={`editDetail-${index}`}>
                            <div style={{ fontWeight: 'bold' }}>{key}:</div>
                            <div>
                                Change to: <Form.Control type="text" value={key} onChange={(e) => handleDetailChange(key, e.target.value)} />
                            </div>
                            <Button variant="danger" onClick={() => handleDeleteDetail(key)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </Form.Group>
                    ))}
                    <Button onClick={handleAddDetail}>Add Detail</Button>
                </Form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel <FontAwesomeIcon icon={faTimes} />
                </Button>
                <Button onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Category'} <FontAwesomeIcon icon={faPlus} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditoKategorinEdetajeve;
