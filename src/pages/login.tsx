import React, { MouseEventHandler, TouchEventHandler, useEffect, useState } from 'react';
import Button from '../components/elements/Button';
import { Rate } from '../components/rate/rateUtils';
import { signIn } from 'next-auth/react';
import RateStars from '../components/rate/login/RateStars';
import { validateRateList, validateAverageRateList } from '../components/rate/rateUtils';
import Image from 'next/image';
import { getClassName } from '../utils';

const LoginPage = () => {
    const backgroundSize = 200;

    const [rates, setRates] = useState<Rate[]>([]);
    const [averageRates, setAverageRates] = useState<Rate[]>([]);
    const [animateAstronaut, setAnimateAstronaut] = useState(false);

    const [cursor, setCursor] = useState<'grab' | 'grabbing'>('grab');
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

    const [containerPos, setContainerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    useEffect(() => {
        const calculatePos = () => {
            const backgroundWidthPx = Math.floor((backgroundSize / 100) * window.innerWidth);
            const backgroundHeightPx = Math.floor((backgroundSize / 100) * window.innerHeight);
            setContainerPos({
                x: -(backgroundWidthPx / 2 - window.innerWidth / 2),
                y: -(backgroundHeightPx / 2 - window.innerHeight / 2),
            });
        };
        if (typeof window !== 'undefined') {
            calculatePos();
            window.addEventListener('resize', calculatePos);
            return () => {
                window.removeEventListener('resize', calculatePos);
            };
        }
    }, []);

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = event => {
        setMousePos({ x: event.clientX, y: event.clientY });
        setCursor('grabbing');
    };
    const handleTouchStart: TouchEventHandler<HTMLDivElement> = event => {
        setMousePos({ x: event.touches[0].clientX, y: event.touches[0].clientY });
        setCursor('grabbing');
    };
    const handleMouseMove: MouseEventHandler<HTMLDivElement> = event => {
        panSky({ x: event.clientX, y: event.clientY })
    };
    const handleTouchMove: TouchEventHandler<HTMLDivElement> = event => {
        panSky({ x: event.touches[0].clientX, y: event.touches[0].clientY })
    };
    const handleMouseUp = () => {
        setMousePos(null);
        setCursor('grab');
    };
    const handleTouchEnd = () => {
        setMousePos(null);
        setCursor('grab');
    };
    const panSky = (newPos: { x: number, y: number }) => {
        if (!mousePos) {
            return;
        }
        const x = newPos.x;
        const y = newPos.y;
        const deltaX = x - mousePos.x;
        const deltaY = y - mousePos.y;
        setContainerPos({ x: containerPos.x + deltaX, y: containerPos.y + deltaY });
        setMousePos({ x, y });
    };

    const getRateList = async () => {
        const response = await fetch('/api/rate', { method: 'GET' });
        const result = await response.json();
        if (response.ok && result && validateRateList(result.rateList) && validateAverageRateList(result.averageRateList)) {
            const rateList = result.rateList;
            const averageRateList = result.averageRateList;
            setRates(rateList);
            setAverageRates(averageRateList);
        }
        if (!response.ok) {
            alert(result?.message || `Failed to get rate list, error code is ${response.status}`);
        }
    };
    useEffect(() => {
        getRateList();
    }, []);

    const onClickSignIn = async () => {
        setAnimateAstronaut(true);
        await signIn('google', { redirect: true, callbackUrl: '/' });
    };

    return <div className="page">
        <Button className="button--dark-theme sign-in-button"
                onClick={onClickSignIn}
                onTouchMove={event => { event.preventDefault(); event.stopPropagation(); }}
                onMouseMove={event => { event.preventDefault(); event.stopPropagation(); }}
        >
            Sign In To Create Your Rate
        </Button>
        <Image src="/astronaut-1.webp"
               alt="Astronaut"
               width={200} height={200}
               className={getClassName(
                   'sign-in-astronaut-image',
                   animateAstronaut && 'sign-in-astronaut-image--animated'
               )}
               onClick={onClickSignIn}
               onTouchMove={event => { event.preventDefault(); event.stopPropagation(); }}
               onMouseMove={event => { event.preventDefault(); event.stopPropagation(); }}
        />
        <div className="stars-background"
             style={{
                 width: `${backgroundSize}%`,
                 height: `${backgroundSize}%`,
                 transform: `translate(${containerPos.x}px, ${containerPos.y}px)`,
                 cursor: cursor
             }}
             onMouseDown={handleMouseDown}
             onTouchStart={handleTouchStart}
             onMouseMove={handleMouseMove}
             onTouchMove={handleTouchMove}
             onMouseUp={handleMouseUp}
             onTouchEnd={handleTouchEnd}
        >
            {
                !!averageRates.length &&
                <RateStars rates={rates} averageRates={averageRates} />
            }
            <div className="stars-background__decor-stars" />
            <div className="stars-background__twinkling" />
        </div>
    </div>;
};

export default LoginPage;
