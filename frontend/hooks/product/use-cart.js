import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [checkout, setCheckout] = useState({
    storename: '',
    storeaddress: '',
  })

  const [product, setProduct] = useState({
    Product_id: 0,
    Product_name: '',
    Product_price: 0,
    Product_desc: '',
    Product_image: '',
    Product_qty: 1,
  })

  // console.log(product)
  const addItem = (product) => {
    const existingItem = item.find(
      (cartItem) => cartItem.Product_id === product.Product_id
    )

    let nextItem

    if (existingItem) {
      nextItem = item.map((cartItem) =>
        cartItem.Product_id === product.Product_id
          ? { ...cartItem, qty: cartItem.qty + 1 }
          : cartItem
      )
    } else {
      const cover = product.Product_photo.split(',')[0]
      const newItem = { ...product, Product_photo: cover, qty: 1 }
      nextItem = [newItem, ...item]
    }

    setItem(nextItem)
    localStorage.setItem('shoppingCart', JSON.stringify(nextItem))
    console.log('button clicked', nextItem)
  }
  const [item, setItem] = useState([])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('shoppingCart')
      if (savedItems) {
        setItem(JSON.parse(savedItems))
      }
    }
  }, [])
  const calcTotalQty = () => {
    let total = 0
    for (let i = 0; i < item.length; i++) {
      total += item[i].qty
    }
    return total
  }
  const [total, setTotal] = useState(0) //計算金錢，因金錢是變動的，所以用useState
  const calcTotalPrice = (item) => {
    let nextTotal = 0
    if (item.length < 0) return '' //預防裡面沒東西
    for (let i = 0; i < item.length; i++) {
      nextTotal += item[i].qty * item[i].Product_price
      // console.log(nextTotal)
    }
    setTotal(nextTotal)
  }
  console.log()

  const [shoppingList, setShoppingList] = useState([])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saveItems = localStorage.getItem('shoppingCart')
      setShoppingList(saveItems ? JSON.parse(saveItems) : item)

      calcTotalPrice(item)
      // console.log(total)
    }
  }, [item])
  //遞增
  const increaseItem = (id) => {
    const nextItem = item.map((v) => {
      if (v.Product_id === id) return { ...v, qty: v.qty + 1 }
      else return v
    })
    setItem(nextItem)
    localStorage.setItem('shoppingCart', JSON.stringify(nextItem))
  }

  //遞減
  const decreaseItem = (id) => {
    const nextItem = item.map((v) => {
      if (v.Product_id === id && v.qty > 1) return { ...v, qty: v.qty - 1 }
      else return v
    })
    setItem(nextItem)
    localStorage.setItem('shoppingCart', JSON.stringify(nextItem))
  }
  //移除
  const removeItem = (id) => {
    const nextItem = item.filter((v) => {
      return v.Product_id !== id
    })
    setItem(nextItem)
    localStorage.setItem('shoppingCart', JSON.stringify(nextItem))
  }

  return (
    <CartContext.Provider
      value={{
        shoppingList,
        total,
        product,
        calcTotalQty,
        increaseItem,
        decreaseItem,
        removeItem,
        addItem,
        setProduct,
        setCheckout,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
