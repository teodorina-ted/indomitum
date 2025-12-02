// File: components/QrScannerWrapper.js
// Next.js version: 15.5.3 (Webpack)

import React from 'react';
import dynamic from 'next/dynamic';

// ======================================================================
// !!! CRITICAL FIX: SSR Disabling for Camera Component !!!
// This prevents the mobile scanner issue by ensuring it only runs in the browser.
// ======================================================================
const DynamicQrScanner = dynamic(
  () => import('./QrScanner'), // <-- This imports your existing QrScanner.js file
  { 
    ssr: false, // <-- THE FIX
    loading: () => <p style={{ textAlign: 'center' }}>🎥 Loading QR Scanner...</p>
  }
);

const QrScannerWrapper = (props) => {
  return <DynamicQrScanner {...props} />;
};

export default QrScannerWrapper;