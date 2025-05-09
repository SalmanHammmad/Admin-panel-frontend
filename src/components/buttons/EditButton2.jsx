import * as React from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';


export default function DeleteButton2({ onClick }) {
    return (     
        <Button variant="outlined" 
        startIcon={<EditIcon />}
        onClick={onClick} 
        >
          Edit
        </Button>  
    );
  }