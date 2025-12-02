// pages/_app.js

import Head from 'next/head';
import { useRouter } from 'next/router';
// Absolute Paths
import { useAuth } from '@/hooks/useAuth'; 
import SeedForm from '@/components/SeedForm'; 
import '@/styles/common.module.css'; 
import commonStyles from '@/styles/common.module.css';


function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { user, loading } = useAuth();

    if (loading) {
        return <div className={commonStyles.loading}>Loading application...</div>;
    }

    if (!user && router.pathname !== '/login') {
        // Optional: Redirect non-logged-in users away from protected routes
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