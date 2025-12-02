// components/QrScanner.js - FINAL STABLE VERSION with Synchronous DOM Cleanup

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode'; 
import styles from '../styles/addplant.module.css';

const QrScanner = ({ onScanSuccess, onClose }) => {
    const html5QrcodeScannerRef = useRef(null);
    const videoContainerRef = useRef(null);
    const [html5QrcodeError, setHtml5QrcodeError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isDomReady, setIsDomReady] = useState(false);
    const containerId = "reader"; // Fixed ID for the container

    // 1. DOM Readiness Check
    useEffect(() => {
        if (videoContainerRef.current) {
            // Ensure container has ID
            if (!videoContainerRef.current.id) {
                videoContainerRef.current.id = containerId;
            }
            setIsDomReady(true);
        }
    }, []);
    
    // Function to handle the successful scan and stop the scanner
    const onScanSuccessCallback = useCallback((decodedText) => {
        const scanner = html5QrcodeScannerRef.current;
        if (scanner) {
            scanner.stop()
                .then(() => {
                    setIsScanning(false);
                    onScanSuccess(decodedText);
                })
                .catch(err => {
                    console.error("Error stopping scanner after success:", err);
                    setIsScanning(false);
                    onScanSuccess(decodedText);
                });
        } else {
             onScanSuccess(decodedText);
        }
    }, [onScanSuccess]);


    // 2. Start/Cleanup Logic
    useEffect(() => {
        if (!isDomReady) return;

        // Initialize scanner if it hasn't been done
        if (!html5QrcodeScannerRef.current) {
            html5QrcodeScannerRef.current = new Html5Qrcode(containerId);
        }
        
        const startScanner = async () => {
            const scanner = html5QrcodeScannerRef.current;
            try {
                // Check if scanner is initialized and not already running
                if (scanner && scanner.getState() !== 2) { 
                    const constraints = { facingMode: 'environment' }; 
    
                    await scanner.start(
                        constraints,
                        { fps: 15, qrbox: { width: 250, height: 250 } },
                        onScanSuccessCallback,
                        (errorMessage) => {
                            if (errorMessage && !errorMessage.includes("No QR code found")) {
                                setHtml5QrcodeError(`Scanner error: ${errorMessage}`);
                            }
                        }
                    );
                    setIsScanning(true);
                }
            } catch (err) {
                setHtml5QrcodeError(`Failed to start camera: ${err.message}`);
                console.error("Camera start error:", err);
            }
        };

        startScanner();

        // -------------------------------------------------------------------
        // !!! CRITICAL FIX: Synchronous Manual DOM Cleanup !!!
        // -------------------------------------------------------------------
        return () => {
            const scanner = html5QrcodeScannerRef.current;
            
            if (scanner && isScanning) {
                // 1. Stop the stream asynchronously (which usually fails the DOM cleanup)
                scanner.stop().catch(err => {
                    if (err && (err.includes("Not Found") || err.name === "NotFoundError")) {
                        console.warn("Suppressing NotFoundError during scanner stop.");
                    } else {
                        console.error("Error during stop:", err);
                    }
                });

                // 2. IMPORTANT: Synchronously clean up the video element.
                const readerDiv = document.getElementById(containerId);
                if (readerDiv) {
                    readerDiv.querySelector('video')?.remove();
                    readerDiv.querySelector('canvas')?.remove();
                }
            }
            // Reset state
            setIsScanning(false);
        };

    }, [isDomReady, isScanning, onScanSuccessCallback]);


    return (
        <div id={containerId} ref={videoContainerRef} className={styles.webcamContainer}>
            {!isScanning && !html5QrcodeError ? (
                <p>Initializing camera...</p>
            ) : null}
            {html5QrcodeError && <p>{html5QrcodeError}</p>}
        </div>
    );
};

export default QrScanner;