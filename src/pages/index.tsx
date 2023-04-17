import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import RateForm from '../components/rate-form/RateForm';
import { getClassName, isClient, isMobile } from '../utils/utils';
import StarsBackground from '../components/layout/StarsBackground';
import RateTable from '../components/rate-table/RateTable';
import useRateFormStore from '../components/rate-form/useRateFormStore';

const RatePage = () => {
    const router = useRouter();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated: () => {
            router.push('login');
        }
    });

    const [currentMobileScreen, setCurrentMobileScreen] = useState<'form' | 'table'>('form');
    const [screenHeight, setScreenHeight] =
        useState(isClient ? document.documentElement.clientHeight : 0);
    useEffect(() => {
        if (isMobile()) {
            const onResize = () => {
                setScreenHeight(document.documentElement.clientHeight);
            };
            window.addEventListener('resize', onResize);
            return () => {
                window.removeEventListener('resize', onResize);
            };
        }
    }, []);

    const changeRateFormSubject = useRateFormStore(state => state.changeSubject);
    const rateFormInputRef = useRateFormStore(state => state.rateInputRef);
    const selectSubjectToRateForm = (subject: string) => {
        changeRateFormSubject(subject);
        if (isMobile() && currentMobileScreen !== 'form') {
            setCurrentMobileScreen('form');
        }
        rateFormInputRef.current?.focus();
    };

    if (!session) {
        return null;
    }

    return <>
        <StarsBackground showStars={!isMobile()} />
        <div className="main-page-grid" style={{ height: isMobile() ? screenHeight : undefined }}>
            <Header className="main-page-grid__header" />
            <div onClick={() => isMobile() && currentMobileScreen !== 'form' && setCurrentMobileScreen('form')}
                 className={
                     getClassName(
                         'main-page-block main-page-block--form pan-screen-child',
                         (isMobile() && currentMobileScreen === 'form') && 'main-page-block--expanded-mobile'
                     )
                 }
            >
                <RateForm />
                <div className="main-page-block__expand-icon">
                    <div className="expand-icon" />
                </div>
            </div>
            <div onClick={() => isMobile() && currentMobileScreen !== 'table' && setCurrentMobileScreen('table')}
                 className={
                     getClassName(
                         'main-page-block main-page-block--table pan-screen-child',
                         (isMobile() && currentMobileScreen === 'table') && 'main-page-block--expanded-mobile'
                     )
                 }
            >
                <RateTable selectSubjectToRateForm={selectSubjectToRateForm} />
                <div className="main-page-block__expand-icon">
                    <div className="expand-icon" />
                </div>
            </div>
        </div>
    </>;
};

export default RatePage;
