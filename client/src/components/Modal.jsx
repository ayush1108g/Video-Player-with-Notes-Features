import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const ImageModal = ({ imageUrl, className }) => {
    const [showModal, setShowModal] = useState(false);  // state to show modal

    const handleClose = () => setShowModal(false);      // function to close modal
    const handleShow = () => setShowModal(true);        // function to show modal

    return (
        <>
            <img src={imageUrl} className={className} alt="loading" onClick={handleShow} style={{ cursor: 'pointer' }} />
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Body>
                    <img src={imageUrl} alt="Fullscreen img" style={{ width: '100%', height: 'auto' }} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ImageModal;
