import TextField from '@mui/material/TextField';

const TextField1 = ({required, name, type, value, onChange, label, onBlur,className}) => {
    return (
        <TextField
            required ={required}
            label={label}
            value={value}
            onChange={onChange}
            name={name}
            type={type}
            onBlur={onBlur}
            //  variant="standard"
            variant="outlined"
            
            color='info'
            
            margin='normal'
            // variant='filled'
            fullWidth  // Optional: Makes the field full width
            className={className}
            InputProps={{
                sx: { padding: '0 0 0 10px  ' } // Adjust the padding as needed
              }}
        />
    );
};

export default TextField1;
