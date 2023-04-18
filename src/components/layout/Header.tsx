import React, { AnchorHTMLAttributes } from 'react';
import { getClassName } from '../../utils/utils';

type HeaderProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const Header = ({ className, ...props }: HeaderProps) => {
    return <a {...props}
              href="/"
              rel="noopener noreferrer"
              className={getClassName('header pan-screen-child', className)}
              title="The project is in development. Even more cool features are coming."
    >
        Rate Anything
    </a>;
};

export default Header;
