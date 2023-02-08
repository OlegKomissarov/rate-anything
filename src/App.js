import React from 'react';
import './styles/main.css';
import Header from './components/layout/Header';
import RatePage from './components/rate/RatePage';

const App = () => {
    return <div className="app">
        <Header />
        <main className="main">
            <RatePage />
        </main>
    </div>;
}

export default App;
