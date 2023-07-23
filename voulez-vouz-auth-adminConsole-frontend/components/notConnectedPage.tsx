import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Web3Button } from '@web3modal/react';
import Image from 'next/image';
import logo from '../images/Logo2.png'; 
import styles from '../styles/Home.module.css';

export const NotConnectedPage = () => {

 return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' , alignItems: 'center',  height: '80vh', alignContent: 'flex-start', mt: '5rem' }}> 
        <Box sx={{ display: 'flex',  flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  width: '100%', height: '100%' , mb: '1rem'}}>
                <Box sx={{display: 'flex',  flexDirection: 'column', justifyContent: 'center', width: '50%', height: '50%', p: '1rem', border: 1, borderRadius: '10px', borderColor: '#e1e3e4', backgroundColor: '#ffffff', alignContent: 'space-between'}}>
                    <Typography align="center" sx={{width: '100%', justifyContent:'center'}}>
                    Welcome to Voules-Vouz Auth! <br />
                    </Typography>
                    <Typography align="center" sx={{width: '100%', justifyContent:'center'}}>
                    Please connect your wallet to manage your account.
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: '20px'}}>
                        <Web3Button />
                        <div className={styles.image}>
                            <Image src={logo} alt="vva-logo" height={150} />
                        </div>
                    </Box>  
                </Box>
        </Box>
    </Box>
      );
};
