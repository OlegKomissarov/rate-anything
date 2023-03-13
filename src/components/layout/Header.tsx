import React, {MouseEventHandler, TouchEventHandler} from 'react';
import {getClassName} from "../../utils/utils";

const Header: React.FC<{
    theme: 'light' | 'dark'
    className?: string
    onMouseDown?: MouseEventHandler<HTMLAnchorElement>
}> = ({ theme, className, onMouseDown
}) => {
    return <a href="/"
              rel="noopener noreferrer"
              className={getClassName(`header header--theme--${theme}`, className)}
              onMouseDown={onMouseDown}
    >
        Rate Anything
    </a>;
};

export default Header;
