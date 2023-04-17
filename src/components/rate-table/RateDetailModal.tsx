import React from 'react';
import { AverageRate, Rate } from '@prisma/client';
import useModal from '../elements/useModal';
import Button from '../elements/Button';
import RateDetailModalContent from './RateDetailModalContent';

const RateDetailModal: React.FC<{
    averageRate: AverageRate & { rates: Rate[] }
    selectSubjectToRateForm: (rate: string) => void
}> = ({ averageRate, selectSubjectToRateForm }) => {
    const { toggleModal, Modal } = useModal();

    return <>
        <Button onClick={toggleModal}
                secondary
                className="open-rate-detail-modal-button"
        >
            Details ({averageRate.ratesAmount})
        </Button>
        <Modal headerText={`${averageRate.subject}: ${averageRate.averageRate}`}>
            <RateDetailModalContent averageRate={averageRate}
                                    selectSubjectToRateForm={selectSubjectToRateForm}
                                    toggleModal={toggleModal}
            />
        </Modal>
    </>;
};

export default RateDetailModal;
