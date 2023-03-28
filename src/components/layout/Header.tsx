import React, { AnchorHTMLAttributes } from 'react';
import { getClassName } from '../../utils/utils';

const Header: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ className, ...props }) => {
    return <a {...props}
              href="/"
              rel="noopener noreferrer"
              className={getClassName('header', className)}
              title="The project is in development. Even more cool features are coming."
    >
        Rate Anything
    </a>;
};

export default Header;
