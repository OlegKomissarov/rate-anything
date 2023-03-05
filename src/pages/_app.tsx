import React from 'react';
import '../styles/main.css';
import Header from '../components/layout/Header';
import Head from 'next/head';

const App = (props: any) => {
    const { Component } = props;

    return <div className="app">
        <Head>
            <title>Rate Anything</title>
        </Head>
        <Header />
        <main className="main">
            <Component />
        </main>
    </div>;
}

export default App;
