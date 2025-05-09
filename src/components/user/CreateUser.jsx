import { useFormHandler } from '../../hooks/useForm';
import { validateUserForm} from '../../utils/validation';
import TextField1 from '../TextFields/TextField1';
import './CreateUser.css';
import CreateButton from '../buttons/CreateButton';
import { useState } from 'react';

const CreateUser = ({ onUserCreated }) => {
    const apiURL = import.meta.env.VITE_API_URL + '/users';
    const [loading, setLoading] = useState(false);
    const { values, handleChange, errors, resetForm } = useFormHandler(
        { name: '', email: '', password: '' },
        validateUserForm,
        apiURL
    );

    const handleSuccess = () => {
        onUserCreated(); // Trigger the refresh in EventManager
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
                    throw new Error('Failed to create user');
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
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    label="Name"
                />
            </div>

            <div>
                <TextField1
                    name="email"
                    type="text"
                    value={values.email}
                    onChange={handleChange}
                    label="Email"
                />
            </div>

            <div>
                <TextField1
                    name="password"
                    type="text"
                    value={values.password}
                    onChange={handleChange}
                    label="Password"
                />
            </div>

            <CreateButton text={'CREATE'} type={'submit'} disabled={loading}>
                {loading ? 'Submitting...' : 'Create User'}
            </CreateButton>
        </form>
    );
};

export default CreateUser;
