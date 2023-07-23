import * as React from 'react';
import { Web3Button } from '@web3modal/react';
import { AppBar, Toolbar, CssBaseline, Box} from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ConnectedPage } from '../components/connectedPage'; 
import { NotConnectedPage } from '../components/notConnectedPage'; 
import styles from '../styles/Home.module.css';
import logo from '../images/Logo2.png'; 
import Image from 'next/image';
import { useAccount } from 'wagmi'


const Home: NextPage = () => {
  const { isConnected } = useAccount(); 
  const [hasMounted, setHasMounted] = React.useState(false);


  // Hooks
  React.useEffect(() => {
        setHasMounted(true);
    }, [])

  // Render
  if (!hasMounted) return null;

  return (
    <div className={styles.container}>
      <Head>
        <title>Voulez-Vous Auth</title>
        <meta
          content="The enterprise ready wallet single sign on authentication through account abstraction"
          name="description"
        />
        <link href="/images/favicon.ico" rel="shortcut icon" />
      </Head>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 
          <CssBaseline />
          <AppBar position="fixed" sx={{ width: `100%`, backgroundColor: "#030935" }}>
            <Toolbar sx={{ display: 'flex', flexDirection: 'row' , justifyContent: 'space-between'}}>
                <Image src={logo} alt="vva-logo" height={60} />
                <Web3Button />
            </Toolbar>
          </AppBar>
        </Box>
        <Box>
          { isConnected == true ? 
          < ConnectedPage />
          :
          < NotConnectedPage />
          }
        </Box>

        <footer className={styles.footer}>
          <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
            Made with ❤️ fuelled by 🥐 & ☕️ at ETHGlobal Paris 2023 🗼🇫🇷
          </a>
        </footer>
      </div>
  );
};

export default Home;
