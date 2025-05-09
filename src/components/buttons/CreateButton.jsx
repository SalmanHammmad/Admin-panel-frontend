import Button from '@mui/material/Button';



 const CreateButton = ({text, type, disabled}) => {
    return (
        <Button text={text} type={type}  disabled={disabled} variant="contained" sx = {{backgroundColor:'#4c714f'}}>
         {text}
        </Button>
    );
}

export default CreateButton;