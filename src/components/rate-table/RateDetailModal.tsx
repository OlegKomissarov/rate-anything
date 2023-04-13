import React from 'react';
import { AverageRate, Rate } from '@prisma/client';
import useModal from '../elements/useModal';
import Button from '../elements/Button';
import RateDetailModalContent from './RateDetailModalContent';

const RateDetailModal: React.FC<{
    averageRate: AverageRate & { rates: Rate[] }
}> = ({ averageRate }) => {
    const { toggleModal, Modal } = useModal();

    return <>
        <Button onClick={toggleModal}
                className="button--secondary"
        >
            Details ({averageRate.ratesAmount})
        </Button>
        <Modal headerText={`${averageRate.subject}: ${averageRate.averageRate}`}>
            <RateDetailModalContent averageRate={averageRate} />
        </Modal>
    </>;
};

export default RateDetailModal;
