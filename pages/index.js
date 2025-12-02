import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { useState } from 'react';
import styles from '../styles/landing.module.css';

// SVG Icons
const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={styles.socialIcon}
  >
    <path d="M20.447 20.452h-3.554v-5.06a1.002 1.002 0 01.996-1.002 1.002 1.002 0 011.002.996v5.066h3.552zm-3.554 1.547H20.447v-8.544h-3.554zM9.547 20.452h-3.555V10.451h3.555zM11.391 8.948a2.993 2.993 0 00-2.992-2.992c-1.65 0-2.992 1.342-2.992 2.992a2.993 2.993 0 002.992 2.992c1.65 0 2.992-1.342 2.992-2.992zm1.609 1.547h1.002v1.002h-1.002zM12.916 10.495H11.391a1.002 1.002 0 01-.996-1.002c0-.55.454-1.002 1.002-1.002a1.002 1.002 0 011.002 1.002h-1.008zm1.084 1.547V10.451h3.554v1.547zM22.002 24H1.998A1.999 1.999 0 010 22.002V1.998A1.999 1.999 0 011.998 0h20.004A1.999 1.999 0 0124 1.998v20.004A1.999 1.999 0 0122.002 24zM2.5 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={styles.socialIcon}
  >
    <path d="M12 0c-3.35 0-3.778.012-5.082.072-1.303.06-2.07.248-2.82.522-.75.275-1.385.642-1.928 1.185-.542.543-.91 1.178-1.185 1.928-.274.75-.462 1.517-.522 2.82C.012 8.222 0 8.65 0 12c0 3.35.012 3.778.072 5.082.06 1.303.248 2.07.522 2.82.275.75.642 1.385 1.185 1.928.543.542 1.178.91 1.928 1.185.75.274 1.517.462 2.82.522C8.222 23.988 8.65 24 12 24c3.35 0 3.778-.012 5.082-.072 1.303-.06 2.07-.248 2.82-.522.75-.275 1.385-.642 1.928-1.185.542-.543.91-1.178 1.185-1.928.274-.75.462-1.517.522-2.82.06-1.304.072-1.732.072-5.082s-.012-3.778-.072-5.082c-.06-1.303-.248-2.07-.522-2.82-.275-.75-.642-1.385-1.185-1.928C21.385.642 20.75.275 20 0zM12 21.39a9.39 9.39 0 110-18.78 9.39 9.39 0 010 18.78zM12 5a7 7 0 100 14 7 7 0 000-14zM12 8a4 4 0 110 8 4 4 0 010-8zM17.5 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={styles.socialIcon}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.11.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.756-1.334-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.238 1.838 1.238 1.07 1.835 2.809 1.305 3.49.997.108-.775.418-1.305.762-1.605-2.665-.3-5.464-1.332-5.464-5.94 0-1.31.465-2.38 1.235-3.22-.12-.3-.53-1.52-.115-3.175 0 0 1-.32 3.3 1.23.955-.266 1.983-.399 3.01-.399 1.028 0 2.055.133 3.01.399 2.3-1.55 3.3-1.23 3.3-1.23.415 1.655.005 2.875-.12 3.175.77.84 1.235 1.91 1.235 3.22 0 4.62-2.8 5.63-5.475 5.92.42.365.815 1.09.815 2.185 0 1.6-.015 2.89-.015 3.28 0 .32.21.69.825.57 4.762-1.58 8.199-6.085 8.199-11.385C24 5.673 18.627.297 12 .297z" />
  </svg>
);


const Home = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Indomitum - Home</title>
        <meta name="description" content="Indomitum landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.landingContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logoText}>Indomitum</div>
          <nav className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}>
            <ul>
              <li><Link href="#hero">Home</Link></li>
              <li><Link href="#about">About</Link></li>
              <li><Link href="#instructions">Instructions</Link></li>
              <li><Link href="#partner">Partner</Link></li>
              <li><Link href="#contact">Contact</Link></li>
            </ul>
          </nav>
          <div className={styles.menuToggle} onClick={() => setIsNavOpen(!isNavOpen)}>
            ☰
          </div>
        </header>

        {/* Hero Section */}
        <section id="hero" className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Your Title Here</h1>
            <p className={styles.heroSubtitle}>Your Subtitle Here</p>
            <div className={styles.heroButtons}>
              <Link href="/login" className={`${styles.button} ${styles.buttonPrimary}`}>Get Started</Link>
              <a href="#" className={`${styles.button} ${styles.buttonSecondary}`}>Scan QR</a>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            <Image
              src="/images/lettuce.jpg"
              alt="A stock photo of a piece of lettuce"
              className={styles.heroCoverImage}
              fill
            />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className={styles.aboutSection}>
          <h2 className={styles.sectionTitle}>About Us</h2>
          <p>This is where you can write a brief description about your company, mission, and values.</p>
        </section>

        {/* Instructions Section */}
        <section id="instructions" className={styles.instructionsSection}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.instructionsGrid}>
            <div className={styles.instructionCard}>
              <div className={styles.instructionIcon}>1</div>
              <h3>Step One</h3>
              <p>Description for the first step.</p>
            </div>
            <div className={styles.instructionCard}>
              <div className={styles.instructionIcon}>2</div>
              <h3>Step Two</h3>
              <p>Description for the second step.</p>
            </div>
            <div className={styles.instructionCard}>
              <div className={styles.instructionIcon}>3</div>
              <h3>Step Three</h3>
              <p>Description for the third step.</p>
            </div>
          </div>
        </section>

        {/* Partner Section */}
        <section id="partner" className={styles.partnerSection}>
          <h2 className={styles.sectionTitle}>Become a Partner</h2>
          <div className={styles.partnerForm}>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="partnerName">Name</label>
                <input type="text" id="partnerName" className={styles.inputField} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="partnerEmail">Email</label>
                <input type="email" id="partnerEmail" className={styles.inputField} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="partnerMessage">Message</label>
                <textarea id="partnerMessage" className={styles.textareaField}></textarea>
              </div>
              <button type="submit" className={styles.button}>Submit</button>
            </form>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <div className={styles.contactDetails}>
            <p>Email: <a href="mailto:contact@indomitum.com">contact@indomitum.com</a></p>
            <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
            <div className={styles.socialLinks}>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><GitHubIcon /></a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>&copy; 2025 Indomitum. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Home;