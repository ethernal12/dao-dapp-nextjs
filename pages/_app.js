import 'react-toastify/dist/ReactToastify.css';
import '@styles/globals.css'
import { ToastContainer, toast } from 'react-toastify';
import { Header } from '@components/UI/common';


const Noop = ({children}) =><>{children}</>

function MyApp({ Component, pageProps }) {

  const Layout = Component.Layout ?? Noop
  return (


    <Layout>
     
      <ToastContainer
      position="top-center"
      style={{  height:"1000px", width:"1000px"  }}
      />
      <Component {...pageProps} />

    </Layout>

  )

}

export default MyApp
