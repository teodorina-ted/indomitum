import React, { useState, useMemo } from 'react';
import styles from '../styles/table.module.css'; // Assuming you have a CSS module for the table

// NOTE: The 'data' prop from AdminDashboard.js is now named 'data'
// The onDeleteSelected and onEdit props come from AdminDashboard.js
const Table = ({ data = [], onEdit, onDeleteSelected, onExport }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // Define the columns you want to display
    const columns = useMemo(() => [
        { key: 'id', label: 'Plant ID' },
        { key: 'name', label: 'Name' },
        { key: 'city', label: 'City' },
        { key: 'country', label: 'Country' },
        { key: 'dateAdded', label: 'Date Added' },
        // Add more columns as needed
    ], []);

    // --- Sorting Logic ---
    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
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

    // --- Selection Logic ---
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
            // Call the parent handler function passed from AdminDashboard.js
            onDeleteSelected(selectedRows);
            setSelectedRows([]); // Clear selection after initiating delete
        }
    };
    
    const handleEditClick = (plant) => {
        // Call the parent handler function passed from AdminDashboard.js
        onEdit(plant);
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
                    Delete Selected ({selectedRows.length})
                </button>
                <button
                    className={`${styles.actionButton} ${styles.exportButton}`}
                    onClick={onExport}
                >
                    Export Data
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
                                    {plant[column.key] || 'N/A'}
                                </td>
                            ))}
                            <td className={styles.actionCell}>
                                <button 
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                    onClick={() => handleEditClick(plant)}
                                >
                                    Edit
                                </button>
                                {/* Optionally add a single-row delete button here */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;