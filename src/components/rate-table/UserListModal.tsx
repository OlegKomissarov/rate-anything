import React from 'react';
import { AverageRate, Rate } from '@prisma/client';
import useModal from '../elements/useModal';
import Button from '../elements/Button';

const UserListModal: React.FC<{
    averageRate: AverageRate & { rates: Rate[] }
}> = ({ averageRate }) => {
    const { toggleModal, Modal } = useModal();

    return <div>
        <Button onClick={toggleModal}
                className="button--secondary"
        >
            Details
        </Button>
        <Modal headerText="User List">
            {
                averageRate.rates.map(rate =>
                    <div key={rate.id}>
                        {rate.userName}
                    </div>
                )
            }
        </Modal>
    </div>;
};

export default UserListModal;
