// pages/plant/add.jsx

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
// Absolute Path Correction
import { useAuth } from '@/hooks/useAuth'; 
import SeedForm from '@/components/SeedForm';
import commonStyles from '@/styles/common.module.css';

// =========================================================
// !!! ACTUAL APP_ID SET (CONFIRMED) !!!
// =========================================================
const APP_ID = "1:1017219023687:web:d51b5df99f54d1cab68262"; 
// =========================================================


export default function AddPlantPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1); 
    const [plantData, setPlantData] = useState({
        id: '', name: '', notes: '', imageUrl: '', latitude: '', longitude: '',
        address: '', city: '', country: '', zip: '', dateUploaded: '', addedBy: ''
    });

    // Handle authentication redirect
    if (loading) {
        return <div className={commonStyles.loading}>Loading...</div>;
    }

    if (!user) {
        router.push('/login');
        return null; 
    }

    if (!APP_ID) {
        console.error("FIREBASE ERROR: APP_ID is not configured correctly in add.jsx");
        return <div className={commonStyles.error}>Configuration Error: APP_ID not set.</div>;
    }


    const handleUpdatePlantData = (newData) => {
        setPlantData(prevData => ({ ...prevData, ...newData }));
    };

    const handleNextStep = () => {
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleFinalSubmit = () => {
        setPlantData({
            id: '', name: '', notes: '', imageUrl: '', latitude: '', longitude: '',
            address: '', city: '', country: '', zip: '', dateUploaded: '', addedBy: ''
        });
        router.push('/AdminDashboard'); 
    };

    const handleCancelForm = () => {
        router.push('/AdminDashboard');
    };


    return (
        <div className={commonStyles.container}>
            <Head>
                <title>Add New Plant</title>
            </Head>
            <h1 className={commonStyles.title}>Add New Plant</h1>
            
            <SeedForm
                currentStep={currentStep}
                plantData={plantData}
                updatePlantData={handleUpdatePlantData}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
                onSubmitFinal={handleFinalSubmit}
                onCancel={handleCancelForm}
                user={user}
                appId={APP_ID} // Pass APP_ID down to the form for Firestore writes
            />
        </div>
    );
}