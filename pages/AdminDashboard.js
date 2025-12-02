// pages/AdminDashboard.js

import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { FaFilter, FaMapMarkerAlt, FaPlusCircle, FaTimes, FaFileExport, FaEye, FaTrash } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'; 
import { auth, firestore } from '@/lib/firebase'; 
import AdminLayout from '@/components/AdminLayout'; 
import styles from '../styles/admin.module.css'; 
import commonStyles from '@/styles/common.module.css'; 
import Table from '@/components/Table'; 
import SeedForm from '@/components/SeedForm'; 

const APP_ID = "1:1017219023687:web:d51b5df99f54d1cab68262"; 

// 🔥 Function: Create Google Maps Link (for iOS/Android/Web compatibility)
const createMapLink = (lat, lng) => {
    if (!lat || !lng) return null;
    // Standard URL query format for coordinates
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};


export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [plants, setPlants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // 🔥 State for dynamic filtering and filter pane toggle
    const [filters, setFilters] = useState({ country: '', addedBy: '', dateAdded: '' }); 
    const [showFilters, setShowFilters] = useState(false); // State to toggle filter pane
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0); 
    const [plantData, setPlantData] = useState({
        id: '', name: '', notes: '', imageUrl: '', latitude: '', longitude: '',
        address: '', city: '', country: '', zip: '', dateUploaded: '', addedBy: ''
    });

    // --- Authentication and Data Fetching Effect ---
    useEffect(() => {
        let unsubscribeFirestore = () => {}; 
        
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
                setLoading(false);

                if (!APP_ID) {
                     console.error("Configuration Error: APP_ID not set.");
                     return;
                }
                
                const collectionPath = `artifacts/${APP_ID}/users/${authUser.uid}/plants`;
                const plantsCollectionRef = collection(firestore, collectionPath);
                const plantsQuery = query(plantsCollectionRef, orderBy('name'));
                
                unsubscribeFirestore = onSnapshot(plantsQuery, (snapshot) => {
                    const plantsData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        // 🔥 Prepare Display Fields for the Table
                        mapLink: createMapLink(doc.data().latitude, doc.data().longitude),
                        addedByDisplay: doc.data().addedBy === authUser.uid ? 'Me' : 'Other', 
                        ...doc.data()
                    }));
                    setPlants(plantsData);
                }, (error) => {
                    console.error("Firestore subscription error:", error);
                });

            } else {
                router.push('/login');
            }
        });

        return () => {
            unsubscribeAuth();
            if (typeof unsubscribeFirestore === 'function') unsubscribeFirestore();
        };
    }, [router]);

    // --- CRUD Handlers ---
    // 🔥 Delete/Archive Handler
    const handleDeleteSelected = useCallback(async (plantIds) => {
        if (!user || !user.uid || !APP_ID) return;
        if (!window.confirm(`Are you sure you want to permanently delete ${plantIds.length} plant(s)? This action moves them to a simulated bin/archive.`)) return;

        try {
            const deletePromises = plantIds.map(id => {
                const docRef = doc(firestore, `artifacts/${APP_ID}/users/${user.uid}/plants`, id);
                // For a real archive, you would use updateDoc to set a 'deleted: true' flag. 
                return deleteDoc(docRef); // Simulates archiving by removing from the live collection
            });
            await Promise.all(deletePromises);
            alert(`✅ ${plantIds.length} plants deleted/archived successfully.`);
        } catch (error) {
            console.error("Error deleting documents:", error);
            alert(`❌ Failed to delete plants. Error: ${error.message}`);
        }
    }, [user]);

    const handleEdit = useCallback((data) => {
        setPlantData(data); 
        setCurrentStep(1); 
    }, []);

    // 🔥 Open Plant Card (Detail View)
    const handleOpenCard = useCallback((plantId) => {
        // This assumes you have a /plant/detail/[id] page setup
        router.push(`/plant/detail/${plantId}`);
    }, [router]);


    // 🔥 Export Handler (Basic CSV logic for full function)
    const handleExport = () => {
        if (filteredAndSearchedPlants.length === 0) {
            alert("No data to export.");
            return;
        }
        
        const headers = ["ID", "Name", "Date Added", "Latitude", "Longitude", "Added By"];
        const csvContent = [
            headers.join(","),
            ...filteredAndSearchedPlants.map(p => 
                `${p.id},"${p.name || ''}",${p.dateAdded || ''},${p.latitude || ''},${p.longitude || ''},"${p.addedByDisplay || ''}"`
            )
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "indomitum_plant_inventory.csv";
        link.click();
        alert("✅ Export successful.");
    }
    
    // --- Filter Handlers ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({ country: '', addedBy: '', dateAdded: '' });
    };

    const filteredAndSearchedPlants = plants.filter(plant => {
        const lowerSearchQuery = searchQuery.toLowerCase();
        const matchesSearch = plant.name?.toLowerCase().includes(lowerSearchQuery) ||
                              plant.id?.toLowerCase().includes(lowerSearchQuery);
                              
        const matchesFilters = Object.keys(filters).every(key => {
            if (!filters[key]) return true; 
            const filterValue = filters[key].toLowerCase();
            const plantValue = plant[key]?.toString().toLowerCase(); 
            
            if (!plantValue) return false;
            
            return plantValue.includes(filterValue);
        });
        
        return matchesSearch && matchesFilters;
    });

    if (loading || (user === null && !loading)) { 
        return <div className={commonStyles.loading}>Loading Admin Dashboard...</div>;
    }

    return (
        <AdminLayout>
            <div className={commonStyles.container}>
                <Head><title>Indomitum Admin Dashboard</title></Head>

                {currentStep === 0 ? (
                    <>
                        <h1 className={commonStyles.title}>Indomitum Plant Inventory ({filteredAndSearchedPlants.length} Total)</h1>
                        
                        <div className={styles.controls} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button
                                className={`${commonStyles.button} ${commonStyles.buttonPrimary}`}
                                onClick={handleAddPlantClick}
                            >
                                <FaPlusCircle /> Add New Plant
                            </button>
                            
                            {/* 🔥 Expanding Filter Button */}
                            <button
                                className={`${commonStyles.button} ${commonStyles.buttonSecondary}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FaFilter /> Filters {showFilters ? <FaTimes /> : ''}
                            </button>
                            
                            {/* Export Button (Calls the new handler) */}
                            <button
                                className={`${commonStyles.button} ${commonStyles.buttonSecondary}`}
                                onClick={handleExport}
                            >
                                <FaFileExport /> Export
                            </button>
                        </div>
                        
                        {/* 🔥 Expandable Filter Pane */}
                        {showFilters && (
                            <div className={styles.filterPane} style={{ padding: '15px', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-medium)', marginBottom: '20px', display: 'flex', gap: '10px', backgroundColor: 'var(--color-background-light)' }}>
                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="Search by ID or Name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={commonStyles.input}
                                    style={{ flex: 1, margin: 0 }}
                                />
                                {/* Filter by Country */}
                                <select
                                    name="country"
                                    value={filters.country}
                                    onChange={handleFilterChange}
                                    className={commonStyles.select}
                                    style={{ width: '150px', margin: 0 }}
                                >
                                    <option value="">Filter by Country</option>
                                    <option value="USA">USA</option>
                                    <option value="Italy">Italy</option>
                                </select>
                                
                                {/* Filter by User (Me or Other) */}
                                <select
                                    name="addedBy"
                                    value={filters.addedBy}
                                    onChange={handleFilterChange}
                                    className={commonStyles.select}
                                    style={{ width: '150px', margin: 0 }}
                                >
                                    <option value="">Filter by User</option>
                                    <option value={user.uid}>Me</option>
                                    <option value="other">Other</option>
                                </select>
                                
                                {/* Filter by Date */}
                                <input
                                    type="date"
                                    name="dateAdded"
                                    value={filters.dateAdded}
                                    onChange={handleFilterChange}
                                    className={commonStyles.input}
                                    style={{ width: '150px', margin: 0 }}
                                />

                                {/* Clear Filters */}
                                <button onClick={handleClearFilters} className={commonStyles.buttonSecondary} style={{ margin: 0 }}>
                                    Clear
                                </button>
                            </div>
                        )}

                        {filteredAndSearchedPlants.length > 0 ? (
                            <Table 
                                data={filteredAndSearchedPlants} 
                                onEdit={handleEdit} 
                                onDeleteSelected={handleDeleteSelected} 
                                onOpenCard={handleOpenCard} // 🔥 New prop for detail view
                            />
                        ) : (
                            <p>No plants found matching the criteria. Click 'Add New Plant' to start tracking.</p>
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
                        appId={APP_ID}
                    />
                )}
            </div>
        </AdminLayout>
    );
}