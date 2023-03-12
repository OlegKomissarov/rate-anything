import React from 'react';

const Header: React.FC<{
    theme: 'light' | 'dark'
}> = ({ theme }) => {
    return <a href="/" rel="noopener noreferrer" className={`header header--theme--${theme}`}>
        Rate Anything
    </a>;
};

export default Header;
