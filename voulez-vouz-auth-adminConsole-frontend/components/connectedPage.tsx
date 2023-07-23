import * as React from 'react';
import {  Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { ManageOrg } from './manageOrg'; 
import { ManageUsers } from './manageUsers'; 
import { YourAccount } from './accountPage'; 
import { styled } from "@mui/material/styles";

const StyledToggleButton = styled(ToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: '#030935'
  }
});

export const ConnectedPage = () => {

  const [navigation, setNavigation] = React.useState<string | null>('your account');

  const handleNavigation = (
    event: React.MouseEvent<HTMLElement>,
    newNavigation: string | null,
  ) => {
    setNavigation(newNavigation);
  };


 return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  height: '90vh', alignContent: 'flex-start', mt: '5rem' }}> 
        <Box sx={{ alignContent: 'flex-start', display: 'flex', justifyContent: 'center', alignItems: 'center',  width: '100%', mb: '1rem'}}>
                <ToggleButtonGroup
                value={navigation}
                exclusive
                onChange={handleNavigation}
                aria-label="Navigation"
                >
                    <StyledToggleButton value="your account"> Your account </StyledToggleButton>
                    <StyledToggleButton value="manage org">Manage Organisation</StyledToggleButton>
                    <StyledToggleButton value="manage users">Manage Users</StyledToggleButton>
                </ToggleButtonGroup>
        </Box>
        { navigation == 'your account' ?
          < YourAccount />
          :
          navigation == "manage org" ? < ManageOrg /> : < ManageUsers />

        }
    </Box>
      );
};
