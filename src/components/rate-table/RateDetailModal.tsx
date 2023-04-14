import React from 'react';
import { AverageRate, Rate } from '@prisma/client';
import useModal from '../elements/useModal';
import Button from '../elements/Button';
import RateDetailModalContent from './RateDetailModalContent';

const RateDetailModal: React.FC<{
    averageRate: AverageRate & { rates: Rate[] }
    selectSubjectToRate: (rate: string) => void
}> = ({ averageRate, selectSubjectToRate }) => {
    const { toggleModal, Modal } = useModal();

    return <>
        <Button onClick={toggleModal}
                className="open-rate-detail-modal-button button--secondary"
        >
            Details ({averageRate.ratesAmount})
        </Button>
        <Modal headerText={`${averageRate.subject}: ${averageRate.averageRate}`}>
            <RateDetailModalContent averageRate={averageRate}
                                    selectSubjectToRate={selectSubjectToRate}
                                    toggleModal={toggleModal}
            />
        </Modal>
    </>;
};

export default RateDetailModal;
