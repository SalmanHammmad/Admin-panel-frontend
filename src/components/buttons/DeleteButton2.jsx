import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';


export default function DeleteButton2({ onClick }) {
    return (     
        <Button 
        color="error" variant="outlined" 
        startIcon={<DeleteIcon />}
        onClick={onClick} // Trigger the passed delete function
        >

          Delete
        </Button>  
    );
  }