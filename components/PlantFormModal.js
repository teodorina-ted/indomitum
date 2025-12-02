import { useState, useEffect } from 'react';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import styles from '../styles/plantformmodal.module.css';
import commonStyles from '../styles/common.module.css';

export default function PlantFormModal({ onClose, plant, onUpdate, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        lastWatered: '',
        imageURL: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!plant;

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: plant.name || '',
                species: plant.species || '',
                lastWatered: plant.lastWatered || '',
                imageURL: plant.imageURL || '',
            });
        }
    }, [isEditMode, plant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                // Update an existing plant
                const plantRef = doc(firestore, 'plants', plant.id);
                await updateDoc(plantRef, formData);
                onUpdate(plant.id, formData); 
            } else {
                // Add a new plant
                const plantsCollectionRef = collection(firestore, 'plants');
                const newDocRef = await addDoc(plantsCollectionRef, formData);
                onAdd(newDocRef.id, formData);
            }
            onClose(); 
        } catch (err) {
            console.error('Error submitting plant form:', err);
            setError('Failed to save plant data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalCloseButton} onClick={onClose}>
                    &times;
                </button>
                <h2 className={styles.formTitle}>
                    {isEditMode ? 'Edit Plant' : 'Add New Plant'}
                </h2>
                {error && <p className={styles.errorText}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Plant Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="species">Species</label>
                        <input
                            type="text"
                            id="species"
                            name="species"
                            value={formData.species}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="lastWatered">Last Watered</label>
                        <input
                            type="date"
                            id="lastWatered"
                            name="lastWatered"
                            value={formData.lastWatered}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="imageURL">Image URL</label>
                        <input
                            type="url"
                            id="imageURL"
                            name="imageURL"
                            value={formData.imageURL}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.buttonPrimary}`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Plant'}
                        </button>
                        <button
                            type="button"
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}