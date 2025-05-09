import React, { useState } from 'react';
import DeleteButton from './buttons/DeleteButton';
import { ErrorAlert, SuccessAlert } from './alerts/Alerts'; // Assuming these are your alert components

const DeleteData = ({ route, Id, onDelete }) => {
    const [alert, setAlert] = useState({ type: '', message: '' });  // Manage both type and message in one state
    const apiURL = import.meta.env.VITE_API_URL;

    const handleDelete = async () => {
        try {
            const response = await fetch(`${apiURL}/${route}/${Id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Failed to delete the item.');
            }

            // If successful, call the onDelete function passed from the parent component
            onDelete(Id);

            // Set success alert
            setAlert({ type: 'success', message: `Item with ID ${Id} deleted successfully.` });
            console.log('huehuehue');

        } catch (error) {
            // Set error alert
            setAlert({ type: 'error', message: `Error: ${error.message}` });
        }
    };

    return (
        <div>
            {alert.type === 'error' && <ErrorAlert message={alert.message} />}
            {alert.type === 'success' && <SuccessAlert message={alert.message} />}
            
            <DeleteButton onDelete={handleDelete} />
        </div>
    );
};

export default DeleteData;
