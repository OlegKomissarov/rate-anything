import { useEffect } from 'react';

const useBodyNoScrollBar = () => {
    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('no-scrollbar');
        return () => {
            body.classList.remove('no-scrollbar');
        };
    }, []);
};

export default useBodyNoScrollBar;
