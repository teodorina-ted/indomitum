// File: components/Table.js - FINAL UPDATED CODE
import React, { useState, useMemo } from 'react';
import { FaEdit, FaTrash, FaEye, FaMapMarkerAlt, FaFileExport } from 'react-icons/fa';
// 🔥 Import from the consolidated file name
import styles from '../styles/table.module.css'; 

// NOTE: The 'data' prop now contains mapLink and addedByDisplay fields from AdminDashboard.js
const Table = ({ data = [], onEdit, onDeleteSelected, onOpenCard, onExport }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // --- Define the columns (Updated for new fields) ---
    const columns = useMemo(() => [
        { key: 'id', label: 'Plant ID' },
        { key: 'name', label: 'Name' },
        { key: 'city', label: 'City' },
        { key: 'country', label: 'Country' },
        { key: 'addedByDisplay', label: 'Added By' }, // 🔥 NEW
        { key: 'location', label: 'Location' }, // 🔥 NEW (for Map Link)
        { key: 'dateAdded', label: 'Date Added' },
    ], []);

    // --- Sorting Logic (unchanged) ---
    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                // ... (Sorting logic is correct)
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === '1' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    };

    // --- Selection Logic (unchanged) ---
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = data.map(plant => plant.id);
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prevSelected => 
            prevSelected.includes(id) 
                ? prevSelected.filter(rowId => rowId !== id)
                : [...prevSelected, id]
        );
    };

    const isRowSelected = (id) => selectedRows.includes(id);

    // --- Action Handlers ---
    const handleDeleteClick = () => {
        if (selectedRows.length > 0) {
            onDeleteSelected(selectedRows); // Calls parent handler for archiving/deleting
            setSelectedRows([]); 
        }
    };
    
    const handleEditClick = (plant) => {
        onEdit(plant); // Calls parent handler to launch SeedForm in Edit mode
    };
    
    // --- Render ---

    if (data.length === 0) {
        return <p className={styles.emptyTable}>No plants found matching current criteria.</p>;
    }

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableActions}>
                <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={handleDeleteClick}
                    disabled={selectedRows.length === 0}
                >
                    <FaTrash /> Archive Selected ({selectedRows.length})
                </button>
                <button
                    className={`${styles.actionButton} ${styles.viewButton}`}
                    onClick={onExport}
                >
                    <FaFileExport /> Export Data
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.checkboxCell}>
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedRows.length === data.length && data.length > 0}
                                title="Select All"
                            />
                        </th>
                        {columns.map(column => (
                            <th 
                                key={column.key}
                                onClick={() => requestSort(column.key)}
                                className={styles.sortableHeader}
                            >
                                {column.label}
                                {getSortIndicator(column.key)}
                            </th>
                        ))}
                        <th className={styles.actionCell}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(plant => (
                        <tr 
                            key={plant.id} 
                            className={isRowSelected(plant.id) ? styles.selectedRow : ''}
                        >
                            <td className={styles.checkboxCell}>
                                <input
                                    type="checkbox"
                                    checked={isRowSelected(plant.id)}
                                    onChange={() => handleSelectRow(plant.id)}
                                />
                            </td>
                            {columns.map(column => (
                                <td key={column.key}>
                                    {/* 🔥 Custom rendering for Location (Map Link) */}
                                    {column.key === 'location' && plant.mapLink ? (
                                        <a 
                                            href={plant.mapLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.coordinatesLink}
                                            title={`Open Lat: ${plant.latitude}, Lng: ${plant.longitude}`}
                                        >
                                            <FaMapMarkerAlt /> View Map
                                        </a>
                                    ) : column.key === 'location' ? (
                                        'N/A'
                                    ) : (
                                        // Renders other data fields (id, name, city, addedByDisplay, etc.)
                                        plant[column.key] || 'N/A'
                                    )}
                                </td>
                            ))}
                            <td className={styles.actionsCell}>
                                {/* 🔥 Open Plant Card Button */}
                                <button
                                    className={`${styles.actionButton} ${styles.viewButton}`}
                                    onClick={() => onOpenCard(plant.id)}
                                >
                                    <FaEye /> View
                                </button>
                                {/* Edit Button */}
                                <button 
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                    onClick={() => handleEditClick(plant)}
                                >
                                    <FaEdit /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;