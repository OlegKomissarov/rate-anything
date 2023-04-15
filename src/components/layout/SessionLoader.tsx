import Loader from './Loader';
import { useSession } from 'next-auth/react';

const SessionLoader = () => {
    const { status: sessionStatus } = useSession();

    // if (sessionStatus !== 'loading') {
    //     return null;
    // }
    return <Loader className="global-loader" />;
};

export default SessionLoader;
