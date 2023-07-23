import * as React from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  TextField,   
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography
} from '@mui/material';

const organisations = [ 
  { id: 1, name: "Voulez-Vous Auth", teamsize: 4 },
]; 

export const ManageOrg = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
         
    <Box sx={{ width: '50%',justifyConent: 'center', p: '1rem', border: 1, borderRadius: '10px', borderColor: '#e1e3e4', backgroundColor: '#ffffff'}}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create new organization
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>Create new organization</DialogTitle>
        <DialogContent>
        <FormControl sx={{ width: '100%'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyConent: 'center', width: '100%'}}>
                <FormLabel >🪪 Organization Name</FormLabel>
                <TextField label="Name" sx={{ mb:'15px'}}></TextField>
                <FormLabel>📟 Organization ENS</FormLabel>
                <TextField label="ENS" sx={{ mb:'15px'}}></TextField>
                <FormLabel>💻 Organization Website</FormLabel>
                <TextField label="Domain" sx={{ mb:'15px'}}></TextField>
                <FormLabel>❤️🇫🇷 Favorite Place in Paris</FormLabel>
                <TextField label="Place" sx={{ mb:'15px'}}></TextField>
            </Box>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Create organization</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: '100%', pt: '10px'}}>
        <Typography sx={{ width: '100%', fontWeight: 'bold'}}> 
          Your organizations
        </Typography>
        { organisations.length< 1 ?
          <p>Not part of any organizations</p>
          :
          <ul>
            {organisations.map((item) => (
              <Typography key={item.id}> {item.name} </Typography>
            ))}
          </ul>

        }

      </Box>
    </Box>
  );
};
