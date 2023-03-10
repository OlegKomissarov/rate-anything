import React from 'react';

const Header: React.FC<{
    theme: 'light' | 'dark'
}> = ({ theme }) => {
    return <header className={`header header--theme--${theme}`}>
        Rate Anything
    </header>;
};

export default Header;
