import Alert from '@mui/material/Alert';

const CustomError = ({msg}) => {
  return (
    <Alert variant="filled" severity="error">
        {msg}
    </Alert>
  )
}

export default CustomError