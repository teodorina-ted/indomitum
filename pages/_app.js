// File: pages/_app.js - FINAL CLEANED CODE (Fixes Client-Side Crash)

import Head from 'next/head';
import { useRouter } from 'next/router';

// 🔥 CRITICAL: Global CSS MUST be imported first for base variables.
import '../styles/globals.css'; 

import { useAuth } from '@/hooks/useAuth'; 
import commonStyles from '@/styles/common.module.css'; 


function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { user, loading } = useAuth(); 

    if (loading) {
        return <div className={commonStyles.loading}>Loading application...</div>;
    }

    return (
        <>
            <Head>
                <title>Indomitum Plant Management</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className={commonStyles.layout}>
                <header>
                    {/* Header/Navigation here */}
                </header>
                <main className={commonStyles.mainContent}>
                    <Component {...pageProps} />
                </main>
                <footer>
                    {/* Footer here */}
                </footer>
            </div>
        </>
    );
}

export default MyApp;