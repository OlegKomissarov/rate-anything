import React, {AnchorHTMLAttributes} from 'react';
import {getClassName} from "../../utils/utils";

const Header: React.FC<AnchorHTMLAttributes<HTMLAnchorElement> & {
    theme: 'light' | 'dark'
}> = ({ theme, className, ...props }) => {
    return <a {...props}
              href="/"
              rel="noopener noreferrer"
              className={getClassName(`header header--theme--${theme}`, className)}
    >
        Rate Anything
    </a>;
};

export default Header;
