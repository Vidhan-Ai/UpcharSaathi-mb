'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [prescriptionFile, setPrescriptionFile] = useState(null)
  const router = useRouter()

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('medicineCart')
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart))
      } catch (error) {
        console.error('Failed to parse cart data:', error)
        setCart([])
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('medicineCart', JSON.stringify(cart))
  }, [cart])

  // Add item to cart
  const addToCart = (medicine, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id)

      if (existingItem) {
        return prevCart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevCart, {
          id: medicine.id,
          name: medicine.name,
          price: medicine.discountPrice || medicine.price,
          image: medicine.image,
          imageUrl: medicine.imageUrl,
          requiresPrescription: medicine.requiresPrescription,
          quantity
        }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (medicineId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== medicineId))
  }

  // Update item quantity
  const updateQuantity = (medicineId, quantity) => {
    if (quantity < 1) return removeFromCart(medicineId)

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === medicineId ? { ...item, quantity } : item
      )
    )
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    setPrescriptionFile(null)
    localStorage.removeItem('medicineCart')
  }

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  // Check if prescription is required
  const isPrescriptionRequired = () => {
    return cart.some(item => item.requiresPrescription)
  }

  // Handle prescription upload
  const handlePrescriptionUpload = (file) => {
    setPrescriptionFile(file)
  }

  // Proceed to checkout
  const proceedToCheckout = () => {
    // Validate if prescription is required but not uploaded
    if (isPrescriptionRequired() && !prescriptionFile) {
      alert('Please upload a prescription for prescription-only medicines')
      return false
    }

    router.push('/medicines/checkout')
    return true
  }

  // Complete order (simulate payment and order creation)
  const completeOrder = async (shippingDetails) => {
    try {
      // 1. Create order in database
      const orderData = {
        items: cart,
        totalAmount: getTotalPrice(),
        ...shippingDetails
      }

      // 2. If prescription needed, upload it (simulated)
      let prescriptionUrl = null
      if (prescriptionFile) {
        // Simulate file upload (in real app, use API to upload)
        prescriptionUrl = 'simulated-prescription-url.jpg'
      }

      // 3. Initialize payment
      const paymentResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getTotalPrice(),
          orderId: `order_${Date.now()}`
        })
      })

      const paymentData = await paymentResponse.json()

      // 4. Simulate successful payment
      // In a real app, you'd show the Razorpay payment form

      // 5. Clear cart after successful order
      clearCart()

      // 6. Redirect to confirmation page
      router.push('/medicines/checkout/confirmation')
      return true
    } catch (error) {
      console.error('Order completion failed:', error)
      return false
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        isPrescriptionRequired,
        handlePrescriptionUpload,
        proceedToCheckout,
        completeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)