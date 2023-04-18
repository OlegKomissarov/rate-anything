import React, { AnchorHTMLAttributes } from 'react';
import { getClassName } from '../../utils/utils';

type HeaderProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const Header = ({ className, ...props }: HeaderProps) => {
    return <header className={getClassName('header pan-screen-child', className)}>
        <a {...props}
           href="/"
           rel="noopener noreferrer"
           title="This is just an alfa version of the application. Even more cool features are coming."
           className="header__link"
        >
            Rate Anything, test
        </a>
    </header>;
};

export default Header;
