import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import '@/styles/globals.scss'
import AuthContext, { AuthContextProvider } from '@/context/auth-context'
import { CartProvider } from '@/hooks/product/use-cart'
import Loader2 from '../components/loader2' // Import your CustomLoader

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 要document物件出現後才能導入bootstrap的js函式庫
    import('bootstrap/dist/js/bootstrap')
  }, [])

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  // 使用自訂在頁面層級的版面(layout)
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <AuthContextProvider>
      <CartProvider>
        {loading && <Loader2 />}
        {getLayout(<Component {...pageProps} />)}
      </CartProvider>
    </AuthContextProvider>
  )
}
