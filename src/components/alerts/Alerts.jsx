import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export function SuccessAlert({ text }) {
  return (
    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      {text}
    </Alert>
  );
}

export function InfoAlert({ text }) {
  return (
    <Alert severity="info">
      <AlertTitle>Info</AlertTitle>
      {text}
    </Alert>
  );
}

export function WarningAlert({ text }) {
  return (
    <Alert severity="warning">
      <AlertTitle>Warning</AlertTitle>
      {text}
    </Alert>
  );
}

export function ErrorAlert({ text }) {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      {text}
    </Alert>
  );
}
