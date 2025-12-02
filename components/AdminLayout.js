// components/AdminLayout.js (FINAL STABILITY FIX)
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head'; 
import { FaSeedling, FaList, FaPlus, FaTrash, FaSignOutAlt, FaQrcode } from 'react-icons/fa';

// 🔥 FIX: Use absolute paths for stability
import styles from '@/styles/adminlayout.module.css';
import commonStyles from '@/styles/common.module.css';

function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    // In a final setup, this would use firebase signOut
    router.push('/login'); 
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
        <button onClick={handleLogout} className={styles.mobileLogoutButton}>
            <FaSignOutAlt />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <FaSeedling className={styles.appIcon} />
          <button className={styles.closeButton} onClick={closeSidebar}>
            &times;
          </button>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              {/* Correct path to main dashboard */}
              <Link href="/AdminDashboard" className={`${styles.navLink} ${router.pathname === '/AdminDashboard' ? styles.active : ''}`} onClick={closeSidebar}>
                <FaList className={styles.navIcon} /> Dashboard
              </Link>
            </li>
            <li className={styles.navItem}>
              {/* Link that initiates the Add Plant form */}
              <button className={styles.navLink} onClick={() => { closeSidebar(); router.push('/AdminDashboard?action=add'); }}>
                <FaPlus className={styles.navIcon} /> Add New Plant
              </button>
            </li>
            <li className={styles.navItem}>
              <Link href="/scan-qr" className={`${styles.navLink} ${router.pathname === '/scan-qr' ? styles.active : ''}`} onClick={closeSidebar}>
                <FaQrcode className={styles.navIcon} /> Scan QR Code
              </Link>
            </li>
            {/* Recycle Bin link uses a query parameter for filtering the table */}
            <li className={styles.navItem}>
              <Link href="/AdminDashboard?filter=bin" className={`${styles.navLink} ${router.query.filter === 'bin' ? styles.active : ''}`} onClick={closeSidebar}>
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
        {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;