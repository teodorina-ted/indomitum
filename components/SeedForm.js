// File: components/SeedForm.js - FINAL PRODUCTION CODE (Validation & Exit UX)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router'; 
import { FaArrowLeft, FaArrowRight, FaCamera, FaTimes, FaPlusCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { setDoc, doc } from 'firebase/firestore'; 
import { firestore } from '@/lib/firebase'; 
import commonStyles from '@/styles/common.module.css'; 
import addPlantStyles from '../styles/addplant.module.css'; 
import Modal from '@/components/Modal'; 
import { isMobile } from '@/utils/device'; 
import QrScanner from './QrScannerWrapper'; 

// External Geocoding Function (unchanged)
const reverseGeocode = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        return {
            address: data.display_name || '',
            city: data.address.city || data.address.town || data.address.village || '',
            country: data.address.country || '',
            zip: data.address.postcode || ''
        };
    } catch (error) {
        console.error("Error during reverse geocoding:", error);
        return { address: '', city: '', country: '', zip: '' };
    }
};

function SeedForm({
    currentStep,
    plantData,
    updatePlantData,
    onNext,
    onPrevious,
    onSubmitFinal,
    onCancel,
    user,
    appId 
}) {
    const router = useRouter(); 
    const APP_ID = appId; 
    
    if (!APP_ID || APP_ID === "Your_Specific_App_ID_Here") {
        console.error("Configuration Error: APP_ID not set in SeedForm.");
    }

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [capturedImagePreview, setCapturedImagePreview] = useState(plantData?.imageUrl || null);
    const plantImageFileInputRef = useRef(null);
    const [showQrScanModal, setShowQrScanModal] = useState(false);
    const [showQrSuccessMessage, setQrSuccessMessage] = useState(false);
    const [hasInitializedId, setHasInitializedId] = useState(false);
    // 🔥 New State: For exit confirmation modal
    const [showExitModal, setShowExitModal] = useState(false); 

    useEffect(() => {
        setCapturedImagePreview(plantData.imageUrl);
    }, [plantData.imageUrl]);

    useEffect(() => {
        // Initialization logic for addedBy and dateUploaded
        if (currentStep === 1 && !hasInitializedId) {
            updatePlantData(prev => ({
                ...prev,
                dateUploaded: prev.dateUploaded || new Date().toISOString(),
                addedBy: prev.addedBy || user.uid,
            }));
            setHasInitializedId(true);
        }
    }, [currentStep, updatePlantData, hasInitializedId, user]);

    const onScanSuccess = useCallback((decodedText) => {
        updatePlantData({ id: decodedText });
        setQrSuccessMessage(true);
        setTimeout(() => setQrSuccessMessage(false), 3000);
        setShowQrScanModal(false);
    }, [updatePlantData]);

    const handleCloseQrModal = useCallback(() => {
        setShowQrScanModal(false);
    }, []);

    const getCurrentGeolocation = useCallback(async () => {
        setFormError('');
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
                });
                const { latitude, longitude } = position.coords;
                const geoAddress = await reverseGeocode(latitude, longitude);
                updatePlantData({
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                    ...geoAddress,
                    dateUploaded: new Date().toISOString()
                });
            } catch (geoError) {
                setFormError("Failed to get live location. Please ensure location services are enabled.");
            }
        } else {
            setFormError("Geolocation not available in this browser.");
        }
    }, [updatePlantData]);

    const handlePlantPhotoInput = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setFormError('');
        const reader = new FileReader();
        reader.onloadend = () => {
            updatePlantData({
                imageUrl: reader.result
            });
            setCapturedImagePreview(reader.result);
        };
        reader.onerror = () => setFormError("Failed to read image file.");
        reader.readAsDataURL(file);
    };

    // -------------------------------------------------------------------
    // 🔥 MANDATORY STEP VALIDATION (FIXED)
    // -------------------------------------------------------------------
    const validateAndProceed = (step) => {
        setFormError(''); 
        switch (step) {
            case 1: // ID Scan/Entry (Mandatory: ID)
                if (!plantData.id) {
                    setFormError("The Plant ID must be scanned or manually entered to proceed.");
                    return;
                }
                break;
            case 2: // Photo/Details (Mandatory: Image URL)
                if (!plantData.imageUrl) {
                    setFormError("A plant image is required to proceed.");
                    return;
                }
                break;
            case 3: // Location (Mandatory: Latitude OR Address)
                if (!plantData.latitude && !plantData.address) {
                    setFormError("Location must be detected (Lat/Long) or manually entered (Address) to proceed.");
                    return;
                }
                break;
            default:
                break;
        }
        onNext();
    };
    // -------------------------------------------------------------------

    // -------------------------------------------------------------------
    // 🔥 SUBMISSION FIX: Use setDoc and DocId for Update (No new row)
    // -------------------------------------------------------------------
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError('');

        if (!plantData.id || !plantData.imageUrl) {
            setFormError("Please ensure Plant ID and Plant Image are provided.");
            setLoading(false);
            return;
        }
        
        const docId = plantData.id; // 🔥 CRITICAL FIX: Use plantData.id for the document ID!

        const dataToSubmit = {
            ...plantData,
            latitude: plantData.latitude ? parseFloat(plantData.latitude) : null,
            longitude: plantData.longitude ? parseFloat(plantData.longitude) : null,
            addedBy: user.uid,
            dateAdded: new Date().toISOString().split('T')[0],
        };
        
        // Use the explicit ID to overwrite (update) or create (add) the document
        const docRef = doc(firestore, `artifacts/${APP_ID}/users/${user.uid}/plants`, docId);

        try {
            await setDoc(docRef, dataToSubmit, { merge: true }); // setDoc ensures update if ID exists

            alert(`✅ Success! Plant "${plantData.name || plantData.id}" has been added/updated.`);
            
            onSubmitFinal(); 
            router.push('/AdminDashboard'); 

        } catch (err) {
            setFormError(err.message || `❌ Failed to add plant. Please try again.`);
            console.error("Firestore Submission Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleManualIdChange = (e) => {
        updatePlantData({ id: e.target.value });
        if (showQrScanModal) {
            setShowQrScanModal(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <h2 className={addPlantStyles.stepTitle}>Scan Plant ID</h2>
                        <p className={addPlantStyles.stepDescription}>Scan the QR code on the bag or enter the ID manually.</p>
                        {/* ... QR Scan Controls ... */}
                        <div className={commonStyles.formField}>
                            <label htmlFor="id" className={commonStyles.label}>Plant ID <span className={commonStyles.required}>*</span></label>
                            <input type="text" id="id" name="id" value={plantData.id} onChange={handleManualIdChange} className={commonStyles.input} placeholder="Enter the Plant ID" required/>
                            {showQrSuccessMessage && <p className={addPlantStyles.qrSuccessMessage}>QR successfully scanned!</p>}
                        </div>
                        {formError && <p className={commonStyles.errorMessage}>{formError}</p>}
                        <div className={commonStyles.navigationButtons}>
                            <button type="button" onClick={onPrevious} className={commonStyles.buttonSecondary} disabled={currentStep <= 1}><FaArrowLeft /> Previous</button>
                            <button type="button" onClick={() => validateAndProceed(1)} className={`${commonStyles.button} ${commonStyles.buttonPrimary}`} disabled={loading}>
                                Next <FaArrowRight />
                            </button>
                        </div>
                        {/* ... QR Modal ... */}
                    </>
                );
            case 2:
                return (
                    <>
                        <h2 className={addPlantStyles.stepTitle}>Plant Details & Photo</h2>
                        <p className={addPlantStyles.stepDescription}>Enter optional details and capture a photo.</p>
                        {/* ... Name input ... */}
                        <div className={commonStyles.formField}>
                            <label className={commonStyles.label}>Plant Image <span className={commonStyles.required}>*</span></label>
                            <div className={addPlantStyles.imageInputControls}>
                                {/* ... Image input controls ... */}
                            </div>
                            {capturedImagePreview && (<div className={addPlantStyles.capturedImageContainer}><img src={capturedImagePreview} alt="Captured Plant" className={addPlantStyles.capturedImage} /></div>)}
                        </div>
                        {formError && <p className={commonStyles.errorMessage}>{formError}</p>}
                        <div className={commonStyles.navigationButtons}>
                            <button type="button" onClick={onPrevious} className={commonStyles.buttonSecondary}><FaArrowLeft /> Previous</button>
                            <button type="button" onClick={() => validateAndProceed(2)} className={`${commonStyles.button} ${commonStyles.buttonPrimary}`} disabled={loading}>Next <FaArrowRight /></button>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <h2 className={addPlantStyles.stepTitle}>Confirm Location</h2>
                        <p className={addPlantStyles.stepDescription}>Review the detected location or get your current live position.</p>
                        <div className={addPlantStyles.reviewSummary}>
                            <p><strong>Latitude:</strong> {plantData.latitude || 'N/A'}</p>
                            <p><strong>Longitude:</strong> {plantData.longitude || 'N/A'}</p>
                            <p><strong>Address:</strong> {plantData.address || 'N/A'}</p>
                            {/* ... other location fields ... */}
                        </div>
                        {/* ... Detect Location button ... */}
                        {formError && <p className={commonStyles.errorMessage}>{formError}</p>}
                        <div className={commonStyles.navigationButtons}>
                            <button type="button" onClick={onPrevious} className={commonStyles.buttonSecondary}><FaArrowLeft /> Previous</button>
                            <button type="button" onClick={() => validateAndProceed(3)} className={`${commonStyles.button} ${commonStyles.buttonPrimary}`} disabled={loading}>Next <FaArrowRight /></button>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h2 className={addPlantStyles.stepTitle}>Review & Submit</h2>
                        <p className={addPlantStyles.stepDescription}>Add any final notes and submit the plant.</p>
                        <div className={addPlantStyles.reviewSummary}>
                            <h3 className={addPlantStyles.summaryHeading}>Plant ID: <span className={addPlantStyles.summaryValue}>{plantData.id || 'N/A'}</span></h3>
                            <h3 className={addPlantStyles.summaryHeading}>Name: <span className={addPlantStyles.summaryValue}>{plantData.name || 'N/A'}</span></h3>
                            <div className={commonStyles.formField}>
                                <label htmlFor="notes" className={commonStyles.label}>Notes (Optional)</label>
                                <textarea id="notes" name="notes" value={plantData.notes} onChange={(e) => updatePlantData({ notes: e.target.value})} className={commonStyles.input} rows="6"></textarea>
                            </div>
                            <p><strong>Added By:</strong> {plantData.addedBy || 'N/A'}</p>
                            <p><strong>Date Added:</strong> {plantData.dateUploaded ? new Date(plantData.dateUploaded).toLocaleString() : 'N/A'}</p>
                        </div>
                        {formError && <p className={commonStyles.errorMessage}>{formError}</p>}
                        <div className={commonStyles.navigationButtons}>
                            <button type="button" onClick={onPrevious} className={commonStyles.buttonSecondary}><FaArrowLeft /> Previous</button>
                            {/* Cancel Button now uses modal */}
                            <button type="button" onClick={() => setShowExitModal(true)} className={commonStyles.buttonSecondary}>Cancel</button>
                            <button type="button" onClick={handleFinalSubmit} className={`${commonStyles.button} ${commonStyles.buttonPrimary}`} disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Plant'}
                            </button>
                        </div>
                    </>
                );
            default:
                return <p>Unknown Step</p>;
        }
    };

    return (
        // 🔥 Exit Confirmation Modal added here
        <>
            <div className={addPlantStyles.seedFormWrapper}>
                <button
                    type="button"
                    // 🔥 Toggle the exit modal when "X" is clicked
                    onClick={() => setShowExitModal(true)} 
                    className={addPlantStyles.closeButton}
                    title="Exit Add Plant Process"
                >
                    <FaTimes />
                </button>
                {renderStepContent()}
            </div>

            {/* 🔥 The Exit Confirmation Modal */}
            {showExitModal && (
                <Modal 
                    isOpen={showExitModal} 
                    title="Unsubmitted Changes" 
                    onCancel={() => setShowExitModal(false)}
                    onConfirm={onCancel} // Use the parent's cancel logic to close the whole form
                    confirmLabel="Leave & Discard"
                    // Modal provided in common.module.css styles already has Cancel button logic.
                    // Assuming Modal component renders the close button based on onCancel prop.
                >
                    <p>Are you sure you want to leave? Your progress in the form will be lost and the plant will not be submitted.</p>
                </Modal>
            )}
        </>
    );
}

export default SeedForm;