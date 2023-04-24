import type { AppProps } from 'next/app'
import { AuthProvider } from "../context/AuthContext";
import Layout from "@/components/Layout";

import '@/styles/globals.css'
import '@/styles/flashy-error.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <div className="flex justify-center min-h-screen">
          {/*maybe change to this div instead  </div> */}

          <Component {...pageProps} />
        </div>
      </Layout>
    </AuthProvider>

  );
}

export default MyApp;