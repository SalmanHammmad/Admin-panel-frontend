
import { useState } from 'react';


export const useFormHandler = (initialValues, validate, apiEndpoint) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
        if (validate) {
            const validationErrors = validate({ ...values, [name]: value });
            setErrors(validationErrors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
            setLoading(true);
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                const data = await response.json();
                console.log('Success:', data);
                resetForm();
            } catch (error) {
                console.error('Error submitting form:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log('Validation errors:', errors);
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    };

    return { values, handleChange, errors, handleSubmit, resetForm, loading };
};
