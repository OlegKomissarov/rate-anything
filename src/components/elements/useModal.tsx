import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

const useModal = () => {
    const modalRef = useRef(null);

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => setShowModal(showModal => !showModal);

    useEffect(() => {
        const element = modalRef.current;
        if (element) {
            disableBodyScroll(element);
            return () => {
                enableBodyScroll(element);
            };
        }
    });

    const ModalContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
        if (!showModal) {
            return null;
        }
        return createPortal(
            <div className="modal-container"
                 onClick={toggleModal}
                 onMouseDown={event => event.stopPropagation()}
            >
                <div ref={modalRef}
                     className="modal custom-scrollbar"
                     onClick={event => event.stopPropagation()}
                >
                    <div className="modal__close-button" onClick={toggleModal} />
                    {children}
                </div>
            </div>,
            document.body
        );
    };

    return { toggleModal, ModalContainer };
};

export default useModal;
