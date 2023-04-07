import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

const useModal = () => {
    const scrollableElementRef = useRef(null);

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => setShowModal(showModal => !showModal);

    useEffect(() => {
        const element = scrollableElementRef.current;
        if (element) {
            disableBodyScroll(element);
            return () => {
                enableBodyScroll(element);
            };
        }
    });

    const Modal: React.FC<{
        children: ReactNode,
        headerText: string
    }> = ({ children, headerText }) => {
        if (!showModal) {
            return null;
        }
        return createPortal(
            <div className="modal-container"
                 onClick={toggleModal}
                 onMouseDown={event => event.stopPropagation()}
            >
                <div className="modal"
                     onClick={event => event.stopPropagation()}
                >
                    <div className="modal__header">
                        <div className="modal__header-text">
                            {headerText}
                        </div>
                        <div className="close-icon modal__close-button" onClick={toggleModal} />
                    </div>
                    <div ref={scrollableElementRef} className="modal-content custom-scrollbar">
                        {children}
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return { toggleModal, Modal };
};

export default useModal;
