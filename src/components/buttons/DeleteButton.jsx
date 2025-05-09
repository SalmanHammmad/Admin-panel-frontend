import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteButton = ({ onDelete, disabled = false }) => {
  return (
    <IconButton
      aria-label="delete"
      onClick={onDelete} // Trigger the passed delete function
      disabled={disabled} // Disable button if necessary
      color="error" // Red color to indicate delete action
    >
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteButton;
