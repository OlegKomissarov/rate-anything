import React, { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

const useModal = () => {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => setShowModal(showModal => !showModal);

    const ModalContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
        if (!showModal) {
            return null;
        }
        return createPortal(
            <div className="modal-container">
                {children}
            </div>,
            document.body
        );
    };

    return { toggleModal, ModalContainer };
};

export default useModal;
