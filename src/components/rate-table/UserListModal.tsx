import React from 'react';

const UserListModal: React.FC<{
    toggleModal: () => void
}> = ({ toggleModal }) => {

    return <div onClick={toggleModal}>
        user list
    </div>;
};

export default UserListModal;
