import React, { useEffect, useState } from 'react';
import { useDataFetcher } from '../hooks/useDataFetcher';
import TextField1 from './TextFields/TextField1';
import CreateButton from './buttons/CreateButton';

const UpdateForm = ({ entityId, entityType, fields, apiEndpoint, onUpdateSuccess}) => {
    const { data, loading, error, fetchData, setData } = useDataFetcher(`${apiEndpoint}/${entityType}/${entityId}`);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${apiEndpoint}/${entityType}/${entityId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Update failed');
                }
                return response.json();
            })
            .then((data) => {
                if (data.ok) {
                    onUpdateSuccess(data.updatedEntity); // Trigger parent update success
                } else {
                    throw new Error('Update failed: ' + data.message);
                }
            })
            .catch((error) => {
                console.error('Error updating event:', error);
            });
            // Back();
    };



    return (
        <form onSubmit={handleSubmit}>
            {fields.map((field) => (
                <div key={field.name}>
                    <TextField1
                        name={field.name}
                        type="text"
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        label={field.label}
                        required={field.required}
                    />
                </div>
            ))}
            <CreateButton text={'UPDATE'} type={'submit'} disabled={loading} >
            {loading ? 'Submitting...' : 'Update'}
            </CreateButton>
        </form>
    );
};

export default UpdateForm;
