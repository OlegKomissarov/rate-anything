import React, { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { getClassName, useDisableBodyScroll } from '../../utils/utils';

type ModalProps = {
    children: ReactNode | string,
    headerText?: string,
    className?: string
};

const useModal = () => {
    const scrollableElementRef = useDisableBodyScroll<HTMLDivElement>();

    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(showModal => !showModal);

    const Modal = ({ children, headerText, className }: ModalProps) => {
        if (!showModal) {
            return null;
        }
        return createPortal(
            <div className="modal-container"
                 onClick={toggleModal}
                 onMouseDown={event => event.stopPropagation()}
            >
                <div className={getClassName('modal', className)}
                     onClick={event => event.stopPropagation()}
                >
                    <div className="modal__header">
                        <div className="modal__header-text">
                            {headerText}
                        </div>
                        <div className="modal__close-button" onClick={toggleModal}>
                            <div className="close-icon" />
                        </div>
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
