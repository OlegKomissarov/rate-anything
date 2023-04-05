import { useEffect } from 'react';

const useBodyNoScrollBar = () => {
    useEffect(() => {
        document.body.classList.add('no-scrollbar');
        return () => {
            document.body.classList.remove('no-scrollbar');
        };
    }, []);
};

export default useBodyNoScrollBar;
