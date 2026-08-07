# React Context Usage Guide - Jenideals Project

This guide explains how to use React Context in the Jenideals e-commerce project.

## 📦 Available Contexts

Your project has **5 React Contexts** set up:

1. **AuthContext** - User authentication
2. **CountryContext** - Country/currency selection
3. **SearchContext** - Search functionality and filters
4. **CartContext** - Shopping cart management
5. **WishlistContext** - Wishlist management

---

## 🔐 1. AuthContext

Manages user authentication, login, registration, and user profile.

### Usage Example

```jsx
'use client'

import { useAuth } from '@/src/context/AuthContext'

export default function LoginPage() {
  const { user, isAuthenticated, login, logout, loading } = useAuth()

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    })
    
    if (result.success) {
      console.log('Login successful!', result.user)
    } else {
      console.error('Login failed:', result.error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### Available Methods & Properties

- `user` - Current user object (null if not logged in)
- `isAuthenticated` - Boolean indicating if user is logged in
- `loading` - Boolean indicating if auth state is being checked
- `login(credentials)` - Login with email/password
- `register(userData)` - Register new user
- `logout()` - Logout current user
- `updateUser(data)` - Update user profile

---

## 🌍 2. CountryContext

Manages country selection, currency, and pricing with IP detection.

### Usage Example

```jsx
'use client'

import { useCountry } from '@/src/context/CountryContext'

export default function ProductPrice({ usdPrice }) {
  const { country, price, setCountry, isLoading } = useCountry()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <p>Price: {price(usdPrice)}</p>
      <p>Country: {country.name}</p>
      
      {/* Country selector */}
      <select 
        value={country.code} 
        onChange={(e) => {
          const newCountry = countries.find(c => c.code === e.target.value)
          setCountry(newCountry)
        }}
      >
        <option value="in">🇮🇳 India</option>
        <option value="ae">🇦🇪 UAE</option>
      </select>
    </div>
  )
}
```

### Available Methods & Properties

- `country` - Current country object (`{ code, name, city, currency, rate, zipFormat, id }`)
- `setCountry(newCountry)` - Change selected country
- `price(usdAmount)` - Convert USD to local currency with formatting
- `isLoading` - Boolean indicating if country is being detected

---

## 🔍 3. SearchContext

Manages search queries, filters, and search history.

### Usage Example

```jsx
'use client'

import { useSearch } from '@/src/context/SearchContext'

export default function SearchBar() {
  const { 
    searchQuery, 
    search, 
    searchHistory, 
    filters,
    updateFilter,
    clearFilters 
  } = useSearch()

  const [input, setInput] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    search(input)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search products..."
        />
        <button type="submit">Search</button>
      </form>

      {/* Search History */}
      <div>
        <h3>Recent Searches:</h3>
        {searchHistory.map((query, index) => (
          <button key={index} onClick={() => search(query)}>
            {query}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div>
        <select 
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
        </select>

        <button onClick={clearFilters}>Clear Filters</button>
      </div>
    </div>
  )
}
```

### Available Methods & Properties

- `searchQuery` - Current search query string
- `setSearchQuery(query)` - Set search query (without navigating)
- `search(query)` - Perform search and navigate to search page
- `searchHistory` - Array of recent searches (max 10)
- `clearSearchHistory()` - Clear all search history
- `removeFromHistory(query)` - Remove specific query from history
- `filters` - Current filter object
- `updateFilter(name, value)` - Update single filter
- `updateFilters(filtersObject)` - Update multiple filters
- `clearFilters()` - Reset all filters to default

---

## 🛒 4. CartContext

Manages shopping cart with localStorage persistence.

### Usage Example

```jsx
'use client'

import { useCart } from '@/src/context/CartContext'

export default function ProductCard({ product }) {
  const { 
    addToCart, 
    removeFromCart, 
    isInCart, 
    getCartCount,
    cart,
    updateQuantity 
  } = useCart()

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      
      {isInCart(product.id) ? (
        <div>
          <button onClick={() => removeFromCart(product.id)}>
            Remove from Cart
          </button>
          
          {/* Quantity controls */}
          {cart.find(item => item.id === product.id) && (
            <div>
              <button onClick={() => {
                const currentQty = cart.find(item => item.id === product.id).quantity
                updateQuantity(product.id, currentQty - 1)
              }}>-</button>
              
              <span>{cart.find(item => item.id === product.id).quantity}</span>
              
              <button onClick={() => {
                const currentQty = cart.find(item => item.id === product.id).quantity
                updateQuantity(product.id, currentQty + 1)
              }}>+</button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      )}
      
      <p>Cart Items: {getCartCount()}</p>
    </div>
  )
}
```

### Available Methods & Properties

- `cart` - Array of cart items
- `loading` - Boolean indicating if cart is loading
- `addToCart(product, quantity)` - Add product to cart
- `removeFromCart(productId)` - Remove product from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Remove all items from cart
- `getCartTotal()` - Get total cart value
- `getCartCount()` - Get total number of items
- `isInCart(productId)` - Check if product is in cart

---

## ❤️ 5. WishlistContext

Manages user wishlist with localStorage persistence.

### Usage Example

```jsx
'use client'

import { useWishlist } from '@/src/context/WishlistContext'

export default function WishlistButton({ product }) {
  const { isInWishlist, toggleWishlist, getWishlistCount } = useWishlist()

  const inWishlist = isInWishlist(product.id)

  return (
    <div>
      <button onClick={() => toggleWishlist(product)}>
        {inWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
      </button>
      
      <p>Wishlist: {getWishlistCount()} items</p>
    </div>
  )
}
```

### Usage in Wishlist Page

```jsx
'use client'

import { useWishlist } from '@/src/context/WishlistContext'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, loading } = useWishlist()

  if (loading) return <div>Loading wishlist...</div>

  if (wishlist.length === 0) {
    return <div>Your wishlist is empty</div>
  }

  return (
    <div>
      <h1>My Wishlist ({wishlist.length})</h1>
      
      <button onClick={clearWishlist}>Clear All</button>
      
      <div>
        {wishlist.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => removeFromWishlist(product.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Available Methods & Properties

- `wishlist` - Array of wishlist items
- `loading` - Boolean indicating if wishlist is loading
- `addToWishlist(product)` - Add product to wishlist
- `removeFromWishlist(productId)` - Remove product from wishlist
- `toggleWishlist(product)` - Toggle product in/out of wishlist
- `clearWishlist()` - Remove all items from wishlist
- `isInWishlist(productId)` - Check if product is in wishlist
- `getWishlistCount()` - Get total number of items

---

## 🎯 Complete Usage Example

Here's a complete product card component using multiple contexts:

```jsx
'use client'

import { useCart } from '@/src/context/CartContext'
import { useWishlist } from '@/src/context/WishlistContext'
import { useCountry } from '@/src/context/CountryContext'
import { useAuth } from '@/src/context/AuthContext'

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { price } = useCountry()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart')
      return
    }
    addToCart(product)
  }

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      
      <h3>{product.name}</h3>
      
      {/* Price with country conversion */}
      <p className="price">{price(product.price)}</p>
      
      <div className="actions">
        {/* Cart button */}
        <button 
          onClick={handleAddToCart}
          disabled={isInCart(product.id)}
        >
          {isInCart(product.id) ? '✓ In Cart' : '🛒 Add to Cart'}
        </button>
        
        {/* Wishlist button */}
        <button onClick={() => toggleWishlist(product)}>
          {isInWishlist(product.id) ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  )
}
```

---

## 🔧 Creating Your Own Context

If you need to create a new context, follow this pattern:

```jsx
'use client'

import { createContext, useContext, useState } from 'react'

// 1. Create the context
const MyContext = createContext(null)

// 2. Create the provider component
export function MyProvider({ children }) {
  const [state, setState] = useState(initialValue)

  // Your logic here...

  const value = {
    state,
    setState,
    // Add your methods here
  }

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  )
}

// 3. Create a custom hook
export function useMyContext() {
  const context = useContext(MyContext)
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider')
  }
  return context
}
```

Then add it to `app/providers.jsx`:

```jsx
import { MyProvider } from '../src/context/MyContext'

export function Providers({ children }) {
  return (
    <MyProvider>
      {/* Other providers */}
      {children}
    </MyProvider>
  )
}
```

---

## 💡 Best Practices

1. **Always use the custom hook** - Use `useCart()` instead of `useContext(CartContext)`
2. **Check loading states** - Most contexts have a `loading` property
3. **Handle errors** - Wrap context operations in try-catch blocks
4. **'use client' directive** - Always add this at the top of files using contexts
5. **Don't overuse contexts** - Only use for truly global state
6. **Provider order matters** - Put independent providers higher (Auth → Country → Search → Cart → Wishlist)
7. **LocalStorage persistence** - Cart, Wishlist, Country, and Search history persist across sessions

---

## 🚀 Next Steps

- Check the individual context files in `src/context/` for implementation details
- Customize the contexts to match your API endpoints
- Add more contexts as needed following the same pattern
- Consider adding loading indicators and error handling to your UI

Happy coding! 🎉
