import { useFormHandler } from '../../hooks/useForm';
import { validateForm } from '../../utils/validation';
import TextField1 from '../TextFields/TextField1';
import './CreateEvent.css';
import CreateButton from '../buttons/CreateButton';
import { useState } from 'react';

const CreateEvent = ({ onEventCreated }) => {
    const apiURL = import.meta.env.VITE_API_URL + '/events';
    const [loading, setLoading] = useState(false);
    const { values, handleChange, errors, resetForm } = useFormHandler(
        { title: '', description: '', location: '' },
        validateForm,
        apiURL
    );

    const handleSuccess = () => {
        onEventCreated(); // Trigger the refresh in EventManager
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
            setLoading(true);
            try {
                const response = await fetch(apiURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                if (!response.ok) {
                    throw new Error('Failed to create event');
                }
                const data = await response.json();
                console.log('Success:', data);
                resetForm();
                handleSuccess(); // Call handleSuccess after event creation
            } catch (error) {
                console.error('Error submitting form:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log('Validation errors:', errors);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <TextField1
                    name="title"
                    type="text"
                    value={values.title}
                    onChange={handleChange}
                    label="Title"
                />
            </div>

            <div>
                <TextField1
                    name="description"
                    type="text"
                    value={values.description}
                    onChange={handleChange}
                    label="Description"
                />
            </div>

            <div>
                <TextField1
                    name="location"
                    type="text"
                    value={values.location}
                    onChange={handleChange}
                    label="Location"
                />
            </div>

            <CreateButton text={'CREATE'} type={'submit'} disabled={loading}>
                {loading ? 'Submitting...' : 'Create Event'}
            </CreateButton>
        </form>
    );
};

export default CreateEvent;
