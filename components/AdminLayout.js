// components/AdminLayout.js (V1 - Updated: 2025-09-22)
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head'; // Import Head for page title
import { FaSeedling, FaList, FaPlus, FaTrash, FaSignOutAlt, FaQrcode } from 'react-icons/fa';

import styles from '../styles/adminlayout.module.css';
import commonStyles from '../styles/common.module.css';

function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Basic client-side authentication check
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      if (!authToken && router.pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }

    // Close sidebar on route change for mobile
    const handleRouteChange = () => {
      setIsSidebarOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    router.push('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.adminLayout}>
      <Head>
        <title>{title}</title>
      </Head>

      {/* Mobile Header (visible only on small screens) */}
      <header className={styles.mobileHeader}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className={styles.headerTitle}>{title}</h1>
        {/* Logout button for mobile header if desired, or keep only in sidebar */}
        <button onClick={handleLogout} className={styles.mobileLogoutButton}>
            <FaSignOutAlt />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <FaSeedling className={styles.appIcon} />
          {/* Removed appName from here to avoid redundancy next to burger menu */}
          <button className={styles.closeButton} onClick={closeSidebar}>
            &times;
          </button>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/admin" className={`${styles.navLink} ${router.pathname === '/admin' ? styles.active : ''}`} onClick={closeSidebar}>
                <FaList className={styles.navIcon} /> Dashboard
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/admin/add-plant" className={`${styles.navLink} ${router.pathname.startsWith('/admin/add-plant') ? styles.active : ''}`} onClick={closeSidebar}>
                <FaPlus className={styles.navIcon} /> Add New Plant
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/admin/scan-qr" className={`${styles.navLink} ${router.pathname === '/admin/scan-qr' ? styles.active : ''}`} onClick={closeSidebar}>
                <FaQrcode className={styles.navIcon} /> Scan QR Code
              </Link>
            </li>
            {/* Note: Recycle Bin link points to /admin and uses the activeTab state in AdminDashboard */}
            <li className={styles.navItem}>
              <Link href="/admin" className={`${styles.navLink} ${router.pathname === '/admin' && router.query.tab === 'bin' ? styles.active : ''}`} onClick={() => { router.push('/admin?tab=bin'); closeSidebar(); }}>
                <FaTrash className={styles.navIcon} /> Recycle Bin
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FaSignOutAlt className={styles.navIcon} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Overlay for mobile sidebar when open */}
        {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;