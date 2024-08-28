// ModalComponent.tsx
import React, { useState } from 'react';
import { Button, Modal } from 'bootstrap';

const ModalComponent: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div>
     

    </div>
  );
};

export default ModalComponent;