import React from 'react';
import { AverageRate, Rate } from '@prisma/client';
import useModal from '../elements/useModal';
import Button from '../elements/Button';

const UserListModal: React.FC<{
    averageRate: AverageRate & { rates: Rate[] }
}> = ({ averageRate }) => {
    const { toggleModal, Modal } = useModal();

    return <>
        <Button onClick={toggleModal}
                className="button--secondary"
        >
            Details ({averageRate.ratesAmount})
        </Button>
        <Modal headerText="User List">
            {
                averageRate.rates.map(rate =>
                    <div key={rate.id}>
                        {rate.userName}: {rate.rate}
                    </div>
                )
            }
        </Modal>
    </>;
};

export default UserListModal;
