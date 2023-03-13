import {useEffect} from "react";

export default () => {
    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('no-scrollbar');
        return (() => {
            body.classList.remove('no-scrollbar');
        });
    });
};
