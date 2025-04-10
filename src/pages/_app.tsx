import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { ReactElement, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
// import ChatContext from '../context/ChatContext';
import { CreditsProvider } from '../context/CreditsContext';
import CreditHistoryDrawer from "../components/CreditHistoryDrawer";
import { useCredits } from "../context/CreditsContext"

function SafeHydrate({ children }: { children: ReactElement }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
}

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const currentRoute = router.pathname;

  // useEffect(() => {
  //   const userId = localStorage.getItem("userId") || ""
  //   if (userId === "") {
  //     if (currentRoute.includes('interview') && currentRoute.includes('{currentRoute}')) {
  //       return
  //     }else{
  //       localStorage.clear()
  //       router.push('/login')
  //     }
     
  //   }
  //   else {
  //     router.push('/job-listing')
  //   }

  // }, [router, currentRoute]);

  return (
    <ChakraProvider>
      {/* <ChatContext> */}
      <CreditsProvider>
        <div style={{ height: '100%' }}>
          <Toaster position="top-center" reverseOrder={false} />
          <SafeHydrate>
            {/* <Component {...pageProps} /> */}
            <AppContent Component={Component} pageProps={pageProps}/>
          </SafeHydrate>
        </div>
      {/* </ChatContext> */}
      </CreditsProvider>
    </ChakraProvider>
  );
};

const AppContent: React.FC<{ Component: React.ComponentType; pageProps: any }> = ({ Component, pageProps }) => {
  const { isSidebarOpen, closeSidebar } = useCredits();

  return (
    <>
      <Component {...pageProps} />
      {/* Render the Sidebar globally */}
      <CreditHistoryDrawer isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};


export default App;

