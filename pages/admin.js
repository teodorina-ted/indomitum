import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase';
import styles from '../styles/admin.module.css';
import commonStyles from '../styles/common.module.css';
import Table from '../components/Table';
import SeedForm from '../components/SeedForm'; // New component import

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [plants, setPlants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0); // 0 = show table, >0 = show form
    const [plantData, setPlantData] = useState({
        id: '',
        name: '',
        notes: '',
        imageUrl: '',
        latitude: '',
        longitude: '',
        address: '',
        city: '',
        country: '',
        zip: '',
        dateUploaded: '',
        addedBy: ''
    });

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
                setLoading(false);
            } else {
                router.push('/login');
            }
        });

        const plantsQuery = query(collection(firestore, 'plants'), orderBy('name'));
        const unsubscribeFirestore = onSnapshot(plantsQuery, (snapshot) => {
            const plantsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPlants(plantsData);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeFirestore();
        };
    }, [router]);

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
        // The submit logic is now handled inside SeedForm
        // We just need to reset the state and go back to the table
        setPlantData({
            id: '', name: '', notes: '', imageUrl: '', latitude: '', longitude: '',
            address: '', city: '', country: '', zip: '', dateUploaded: '', addedBy: ''
        });
        setCurrentStep(0);
    };

    const handleCancelForm = () => {
        setPlantData({
            id: '', name: '', notes: '', imageUrl: '', latitude: '', longitude: '',
            address: '', city: '', country: '', zip: '', dateUploaded: '', addedBy: ''
        });
        setCurrentStep(0);
    };

    const handleAddPlantClick = () => {
        setPlantData({
            id: '', name: '', notes: '', imageUrl: '', latitude: '', longitude: '',
            address: '', city: '', country: '', zip: '', dateUploaded: '', addedBy: ''
        });
        setCurrentStep(1); // Start the form at step 1
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const filteredAndSearchedPlants = plants.filter(plant => {
        const matchesSearch = plant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              plant.qrID?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilters = Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            return plant[key]?.toLowerCase().includes(filters[key].toLowerCase());
        });
        return matchesSearch && matchesFilters;
    });

    if (loading) {
        return <div className={commonStyles.loading}>Loading Admin Dashboard...</div>;
    }

    return (
        <div className={commonStyles.container}>
            <Head>
                <title>Admin Dashboard</title>
            </Head>

            {currentStep === 0 ? (
                <>
                    <h1 className={styles.title}>Admin Dashboard</h1>
                    <button
                        className={`${commonStyles.button} ${commonStyles.buttonPrimary}`}
                        onClick={handleAddPlantClick}
                    >
                        Add New Plant
                    </button>
                    <div className={styles.controls}>
                        <input
                            type="text"
                            placeholder="Search by name or QR ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <div className={styles.filters}>
                            <select
                                name="country"
                                value={filters.country || ''}
                                onChange={handleFilterChange}
                                className={styles.filterSelect}
                            >
                                <option value="">Filter by Country</option>
                                {Array.from(new Set(plants.map(p => p.country))).map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            <select
                                name="city"
                                value={filters.city || ''}
                                onChange={handleFilterChange}
                                className={styles.filterSelect}
                            >
                                <option value="">Filter by City</option>
                                {Array.from(new Set(plants.map(p => p.city))).map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {plants.length > 0 ? (
                        <Table plants={filteredAndSearchedPlants} />
                    ) : (
                        <p className={styles.emptyState}>No plants found. Click 'Add New Plant' to get started!</p>
                    )}
                </>
            ) : (
                <SeedForm
                    currentStep={currentStep}
                    plantData={plantData}
                    updatePlantData={handleUpdatePlantData}
                    onNext={handleNextStep}
                    onPrevious={handlePreviousStep}
                    onSubmitFinal={handleFinalSubmit}
                    onCancel={handleCancelForm}
                    user={user}
                />
            )}
        </div>
    );
}