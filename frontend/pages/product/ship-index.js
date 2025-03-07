import { useShip711StoreOpener } from '../../hooks/product/use-ship-711-store'
import { useCart } from '@/hooks/product/use-cart'
import { useEffect } from 'react'
import styles from './index.module.css'

export default function Index() {
  // useShip711StoreOpener的第一個傳入參數是"伺服器7-11運送商店用Callback路由網址"
  // 指的是node(express)的對應api路由。詳情請見說明文件:
  const { store711, openWindow, closeWindow } = useShip711StoreOpener(
    'http://localhost:3001/shipment/711',
    { autoCloseMins: 3 } // x分鐘沒完成選擇會自動關閉，預設5分鐘。
  )

  const { checkout, setCheckout } = useCart()

  useEffect(() => {
    setCheckout({
      ...checkout,
      storename: store711.storename,
      storeaddress: store711.storeaddress,
    })
  }, [store711])

  return (
    <>
      <div className="con-12 con-md-12">
        <button
          onClick={() => {
            openWindow()
          }}
          className={styles.test}
        >
          選擇門市
        </button>
        <br />
        門市名稱:{' '}
        <input
          type="text"
          value={store711.storename}
          disabled
          className={styles.test2}
        />
        <br />
        門市地址:{' '}
        <input
          type="text"
          value={store711.storeaddress}
          disabled
          className={styles.test3}
        />
      </div>
    </>
  )
}
