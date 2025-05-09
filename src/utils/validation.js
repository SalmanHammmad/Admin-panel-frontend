export const validateForm = (values) => {
    let errors = {};
    if (!values.title) errors.title = 'Title is required';
    if (!values.description) errors.description = 'Description is required';
    if (!values.location) errors.location = 'Location is required';
    return errors;
};

export const validateUserForm = (values) => {
    let errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    if (!values.password) errors.password = 'Password is required';
    return errors;
};