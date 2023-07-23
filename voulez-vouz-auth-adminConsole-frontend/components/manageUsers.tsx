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
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import users from './users.json';
import DeleteIcon from '@mui/icons-material/Delete';

interface Column {
  id: 'identifier' | 'name' | 'role' | 'walletaddress';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'identifier', label: 'Member #', minWidth: 80 },
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'role',
    label: 'Role',
    minWidth: 100,
  },
  {
    id: 'walletaddress',
    label: 'Wallet Address',
    minWidth: 170,
  }
];

interface Data {
  identifier: number;
  name: string;
  role: string;
  walletaddress: string;
}



export const ManageUsers = () => {
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
         
    <Box sx={{ width: '50%',justifyConent: 'center', p: '1rem', border: 1, borderRadius: '10px', borderColor: '#e1e3e4', backgroundColor: '#ffffff'}}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add new user
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>Add new user</DialogTitle>
        <DialogContent>
          <FormControl sx={{ width: '100%'}}>
              <Box sx={{display: 'flex', flexDirection: 'column', justifyConent: 'center', width: '100%'}}>
                  <FormLabel>👤 User Name</FormLabel>
                  <TextField label="Name" sx={{ mb:'15px'}}></TextField>
                  <FormLabel >📇 User Role</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
                    <FormControlLabel value="Teammember" control={<Radio />} label="Teammember" />
                  </RadioGroup>
                  <FormLabel >🤖 User Wallet Address</FormLabel>
                  <TextField label="0x...." sx={{ mb:'15px'}}></TextField>
              </Box>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Add User</Button>
        </DialogActions>
      </Dialog>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell> Remove </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user.identifier}>
                    {columns.map((column) => {
                      const value = user[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell> 
                      <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                         Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    </Box>
  );
};
