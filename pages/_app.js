// File: pages/_app.js - FINAL CLEANED CODE

import Head from 'next/head';
import { useRouter } from 'next/router';
// 🔥 IMPORTANT: Assuming styles/globals.css is imported somewhere globally or directly in _app.js
// If you are using webpack setup, you must ensure the global styles are loaded.

import { useAuth } from '@/hooks/useAuth'; // Keep the useAuth import
import commonStyles from '@/styles/common.module.css'; // Keep the common styles import

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    // Keep useAuth logic for global loading state and potential redirecting from non-auth routes
    const { user, loading } = useAuth(); 

    // If you are missing a direct import for globals.css, you would add it here:
    // import '../styles/globals.css'; 

    if (loading) {
        return <div className={commonStyles.loading}>Loading application...</div>;
    }

    // Optional: Add logic here to redirect non-logged-in users if needed, but AdminDashboard handles this too.
    /*
    if (!user && router.pathname !== '/login') {
        router.push('/login');
        return null;
    }
    */

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