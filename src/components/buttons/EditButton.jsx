import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';


const EditButton = ({ onClick, disabled = false }) => {
    return (
      <IconButton
        aria-label="delete"
        onClick={onClick} // Trigger the passed delete function
        disabled={disabled} // Disable button if necessary
        color="yellow" // Red color to indicate delete action
      >
        <EditIcon />
      </IconButton>
    );
  };
  
  export default EditButton;
  