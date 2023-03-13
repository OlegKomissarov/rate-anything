import React, {MouseEventHandler, TouchEventHandler} from 'react';
import {getClassName} from "../../utils/utils";

const Header: React.FC<{
    theme: 'light' | 'dark'
    className?: string
    onTouchMove?: TouchEventHandler<HTMLAnchorElement>
    onMouseMove?: MouseEventHandler<HTMLAnchorElement>
    onTouchStart?: TouchEventHandler<HTMLAnchorElement>
    onMouseDown?: MouseEventHandler<HTMLAnchorElement>
    onTouchEnd?: TouchEventHandler<HTMLAnchorElement>
    onMouseUp?: MouseEventHandler<HTMLAnchorElement>
}> = ({ theme, className, onTouchMove, onMouseMove, onTouchStart, onMouseDown, onTouchEnd,
    onMouseUp
}) => {
    return <a href="/"
              rel="noopener noreferrer"
              className={getClassName(`header header--theme--${theme}`, className)}
              onTouchMove={onTouchMove}
              onMouseMove={onMouseMove}
              onTouchStart={onTouchStart}
              onMouseDown={onMouseDown}
              onTouchEnd={onTouchEnd}
              onMouseUp={onMouseUp}
    >
        Rate Anything
    </a>;
};

export default Header;
