// pages/login.js (Full Code with Final Redirect Fix)

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import commonStyles from '@/styles/common.module.css';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for Password Reset Feature
    const [resetEmail, setResetEmail] = useState(''); 
    const [showPasswordReset, setShowPasswordReset] = useState(false); 

    // --- Login Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);
        setIsSubmitting(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            // 🔥 FIX: Ensure redirect path casing matches file name exactly (AdminDashboard.js)
            router.push('/AdminDashboard'); 
            
        } catch (error) {
            let message = "Invalid login credentials. Please check your email and password.";
            if (error.code === 'auth/user-not-found') {
                message = "User not found. Please register or check the email address.";
            } else if (error.code === 'auth/wrong-password') {
                 message = "Invalid password. Try resetting your password.";
            }
            setLoginError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Password Reset Handler ---
    const handlePasswordReset = async () => {
        setLoginError(null);
        if (!resetEmail) {
            setLoginError("Please enter your email address for the reset link.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, resetEmail);
            alert(`Success! Password reset link sent to ${resetEmail}. Check your inbox.`);
            setShowPasswordReset(false); 
        } catch (error) {
            let message = "Error sending reset link. Please ensure the email is valid and registered.";
            if (error.code === 'auth/user-not-found') {
                message = "No account found with that email.";
            }
            setLoginError(message);
            console.error("Password reset error:", error);
        }
    };

    return (
        <div className={commonStyles.layout}>
            <Head><title>Indomitum Login</title></Head>
            {/* The Login box now uses the common.module.css styles */}
            <div className={`${commonStyles.container} ${commonStyles.mainContent}`} style={{ maxWidth: '400px', margin: '100px auto' }}>
                <h1 className={commonStyles.title} style={{ color: 'var(--color-primary)' }}>Indomitum Login</h1>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={commonStyles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={commonStyles.input}
                    />
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`${commonStyles.button} ${commonStyles.buttonPrimary}`} 
                        style={{ width: '100%', backgroundColor: 'var(--color-accent)' }} 
                    >
                        {isSubmitting ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                {/* Forgot Password Link */}
                <div style={{ textAlign: 'right', marginTop: '15px' }}>
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setShowPasswordReset(true); setLoginError(null); }}
                        style={{ fontSize: '0.9rem', color: 'var(--color-secondary)' }}
                    >
                        Forgot Password?
                    </a>
                </div>

                {/* Password Reset Form Modal */}
                {showPasswordReset && (
                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                        <h3 style={{ color: 'var(--color-text-dark)' }}>Reset Password</h3>
                        <input
                            type="email"
                            placeholder="Enter email for reset link"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className={commonStyles.input}
                        />
                        <button
                            onClick={handlePasswordReset}
                            className={`${commonStyles.button} ${commonStyles.buttonPrimary}`} 
                            style={{ backgroundColor: 'var(--color-accent)' }}
                        >
                            Send Reset Link
                        </button>
                        <button
                            onClick={() => { setShowPasswordReset(false); setLoginError(null); }}
                            className={`${commonStyles.button} ${commonStyles.buttonSecondary}`} 
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {loginError && <p className={commonStyles.error} style={{marginTop: '15px'}}>{loginError}</p>}
                
                {/* 💥 SIGN UP LINK 💥 */}
                <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                    <p style={{marginBottom: '10px'}}>Don't have an account?</p>
                    <a 
                        href="/register" 
                        style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}
                    >
                        Create an Account
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;