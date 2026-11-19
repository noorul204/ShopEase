
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Routes, Route, Link, useParams, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Wishlist from './pages/Wishlist'
import heroImage from './assets/shopease-hero.png'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import './App.css'

const categories = [
    { name: 'Electronics', icon: '🎧', description: 'Gadgets & accessories' },
    { name: 'Fashion', icon: '👗', description: 'Style your everyday' },
    { name: 'Beauty', icon: '💄', description: 'Beauty & self-care' },
    { name: 'Home & Living', icon: '🏡', description: 'Make yourself at home' },
    { name: 'Sports & Fitness', icon: '🏋️', description: 'Stay active and healthy' },
    { name: 'Books & Stationery', icon: '📚', description: 'Read, write and create' },
    { name: 'Kitchen & Dining', icon: '🍽️', description: 'Everything for your kitchen' },
    { name: 'Accessories', icon: '👜', description: 'Complete your style' },
    { name: 'Toys & Games', icon: '🧸', description: 'Fun for everyone' },
    { name: 'Grocery & Essentials', icon: '🛒', description: 'Everyday essentials' },
]

function ProductDetails({ cart, setCart, products, productsStatus }) {
    const { id } = useParams()

    if (productsStatus === 'loading') {
        return <h2>Loading product...</h2>
    }

    if (productsStatus === 'error') {
        return <h2>Unable to load products. Please refresh.</h2>
    }

    const product = products.find(
        (item) => String(item.id) === id
    )

    if (!product) {
        return <h2>Product not found!</h2>
    }

    const addToCart = () => {
        setCart((previousCart) => {
            const existingProduct = previousCart.find(
                (item) => item.id === product.id
            )

            if (existingProduct) {
                return previousCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            return [...previousCart, { ...product, quantity: 1 }]
        })

        alert(`${product.name} added to cart!`)
    }

    return (
        <div className="product-details-page">
            <Link to="/" className="back-home">
                ← Back to Home
            </Link>

            <div className="product-details-container">
                <div className="product-details-image">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="product-details-info">
                    <span>{product.category}</span>
                    <h1>{product.name}</h1>

                    <p className="product-rating">
                        ★ {product.rating} Customer rating
                    </p>

                    <h2>₹{product.price.toLocaleString('en-IN')}</h2>

                    <p>{product.description}</p>

                    <button
                        className="add-cart-button"
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

function CartPage({ cart, setCart }) {
    const increaseQuantity = (id) => {
        setCart((previousCart) =>
            previousCart.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        )
    }

    const decreaseQuantity = (id) => {
        setCart((previousCart) =>
            previousCart
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        )
    }

    const removeItem = (id) => {
        setCart((previousCart) =>
            previousCart.filter((item) => item.id !== id)
        )
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>

            {cart.length === 0 ? (
                <p>Your cart is empty!</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <img src={item.image} alt={item.name} />

                            <div>
                                <h3>{item.name}</h3>
                                <p>₹{item.price.toLocaleString('en-IN')}</p>

                                <button onClick={() => decreaseQuantity(item.id)}>
                                    -
                                </button>

                                <span> {item.quantity} </span>

                                <button onClick={() => increaseQuantity(item.id)}>
                                    +
                                </button>

                                <button onClick={() => removeItem(item.id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <h2>
                        Total: ₹{total.toLocaleString('en-IN')}
                    </h2>

                    <Link to="/checkout" className="checkout-button">
                        Proceed to Checkout →
                    </Link>
                </>
            )}
        </div>
    )
}

function HomePage({
    cart,
    setCart,
    wishlist,
    setWishlist,
    products,
    currentUser,
    onLogout
}) {
    const toggleWishlist = (product) => {
        setWishlist((currentWishlist) => {
            const alreadyAdded = currentWishlist.some(
                (item) => item.id === product.id
            )

            if (alreadyAdded) {
                return currentWishlist.filter(
                    (item) => item.id !== product.id
                )
            }

            return [...currentWishlist, product]
        })
    }

    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [sortOrder, setSortOrder] = useState('default')

    function addToCart(product) {
        setCart((currentCart) => {
            const existingProduct = currentCart.find(
                (item) => item.id === product.id
            )

            if (existingProduct) {
                return currentCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            return [...currentCart, { ...product, quantity: 1 }]
        })
    }

    function increaseQuantity(id) {
        setCart((currentCart) =>
            currentCart.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        )
    }

    function decreaseQuantity(id) {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        )
    }

    function removeFromCart(id) {
        setCart((currentCart) =>
            currentCart.filter((item) => item.id !== id)
        )
    }

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    )

    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    )

    let filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase())

        const matchesCategory =
            selectedCategory === 'All' ||
            product.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    if (sortOrder === 'low-to-high') {
        filteredProducts = [...filteredProducts].sort(
            (a, b) => a.price - b.price
        )
    } else if (sortOrder === 'high-to-low') {
        filteredProducts = [...filteredProducts].sort(
            (a, b) => b.price - a.price
        )
    }

    return (
        <div className="app">

            <div className="announcement-bar">
                <p>✨ Special offers are waiting for you! Happy Shopping!</p>
            </div>

            <nav className="navbar">
                <Link to="/" className="logo">
                    ShopEase<span>.</span>
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <a href="#categories">Categories</a>
                    <a href="#products">Products</a>
                    <a href="#footer">About</a>
                </div>

                <div className="search-box">
                    <span>⌕</span>
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="nav-actions">
                    {currentUser ? (
                        <>
                            <Link to="/profile" className="profile-nav-button">
                                👤 {currentUser.name}
                            </Link>

                            {currentUser.role === 'admin' && (
                                <Link to="/admin" className="profile-nav-button">
                                    Admin Dashboard
                                </Link>
                            )}

                            <button
                                className="login-button"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="login-button">
                                Login
                            </Link>

                            <Link to="/register" className="profile-nav-button">
                                Register
                            </Link>
                        </>
                    )}

                    <Link to="/wishlist" className="wishlist-nav-button">
                        ❤️ Wishlist
                    </Link>

                    <Link to="/cart" className="cart-button">
                        🛒 <span>Cart</span>
                        <span className="cart-count">{cartCount}</span>
                    </Link>
                </div>
            </nav>

            <main>

                <section className="hero">
                    <div className="hero-content">
                        <span className="hero-tag">
                            YOUR EVERYDAY SHOPPING DESTINATION
                        </span>

                        <h1>
                            Discover More.
                            <br />
                            <span>Shop Better.</span>
                        </h1>

                        <p className="hero-description">
                            Find the things you love, explore new favourites
                            and enjoy a simple shopping experience — all in
                            one place.
                        </p>

                        <div className="hero-buttons">
                            <a href="#products" className="shop-button">
                                Explore Products <span>→</span>
                            </a>

                            <a href="#categories" className="secondary-button">
                                Browse Categories
                            </a>
                        </div>

                        <div className="hero-highlights">
                            <div>
                                <strong>Quality</strong>
                                <span>Products</span>
                            </div>
                            <div>
                                <strong>Great</strong>
                                <span>Prices</span>
                            </div>
                            <div>
                                <strong>Easy</strong>
                                <span>Shopping</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-image-area">
                        <div className="hero-image-circle"></div>

                        <img
                            className="hero-image"
                            src={heroImage}
                            alt="Cute pastel shopping bags and gifts"
                        />

                        <div className="floating-card">
                            <span>🛍️</span>
                            <div>
                                <strong>Love to shop?</strong>
                                <p>You're in the right place!</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="benefits">
                    <div className="benefit-item">
                        <span>🚚</span>
                        <div>
                            <h3>Easy Shopping</h3>
                            <p>A smooth shopping experience</p>
                        </div>
                    </div>

                    <div className="benefit-item">
                        <span>💎</span>
                        <div>
                            <h3>Quality Products</h3>
                            <p>Products you'll love</p>
                        </div>
                    </div>

                    <div className="benefit-item">
                        <span>🔒</span>
                        <div>
                            <h3>Secure Experience</h3>
                            <p>Designed with care</p>
                        </div>
                    </div>

                    <div className="benefit-item">
                        <span>💬</span>
                        <div>
                            <h3>Customer First</h3>
                            <p>Your satisfaction matters</p>
                        </div>
                    </div>
                </section>

                <section className="categories section-container" id="categories">
                    <div className="section-heading">
                        <div>
                            <span className="section-tag">EXPLORE OUR COLLECTION</span>
                            <h2>Shop by Category</h2>
                            <p>Find exactly what you're looking for.</p>
                        </div>

                        <button
                            className="text-link"
                            onClick={() => {
                                setSelectedCategory('All')
                                document.getElementById('products')?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }}
                        >
                            View all products →
                        </button>
                    </div>

                    <div className="category-list">
                        {categories.map((category) => (
                            <button
                                className={`category-card ${
                                    selectedCategory === category.name ? 'active' : ''
                                }`}
                                key={category.name}
                                onClick={() => {
                                    setSelectedCategory(category.name)
                                    document.getElementById('products')?.scrollIntoView({
                                        behavior: 'smooth',
                                    })
                                }}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <h3>{category.name}</h3>
                                <p>{category.description}</p>
                                <span className="category-arrow">↗</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="products-section" id="products">
                    <div className="section-container">
                        <div className="section-heading">
                            <div>
                                <span className="section-tag">HANDPICKED FOR YOU</span>
                                <h2>Featured Products</h2>
                                <p>Discover some of our favourite picks.</p>
                            </div>

                            <select
                                className="sort-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                aria-label="Sort products"
                            >
                                <option value="default">Sort: Recommended</option>
                                <option value="low-to-high">Price: Low to High</option>
                                <option value="high-to-low">Price: High to Low</option>
                            </select>
                        </div>

                        <div className="filter-row">
                            {[
                                'All',
                                'Electronics',
                                'Fashion',
                                'Beauty',
                                'Home & Living',
                                'Sports & Fitness',
                                'Books & Stationery',
                                'Kitchen & Dining',
                                'Accessories',
                                'Toys & Games',
                                'Grocery & Essentials'
                            ].map((category) => (
                                <button
                                    key={category}
                                    className={`filter-button ${
                                        selectedCategory === category ? 'selected' : ''
                                    }`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category === 'All' ? 'All Products' : category}
                                </button>
                            ))}
                        </div>

                        <div className="product-list">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <article className="product-card" key={product.id}>
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="product-detail-link"
                                        >
                                            <div className="product-image">
                                                <img src={product.image} alt={product.name} />
                                                <span className="product-tag">{product.tag}</span>
                                            </div>
                                        </Link>

                                        <div className="product-details">
                                            <button
                                                className="wishlist-heart-button"
                                                onClick={() => toggleWishlist(product)}
                                                aria-label="Add to wishlist"
                                            >
                                                {wishlist.some(
                                                    (item) => item.id === product.id
                                                ) ? '❤️' : '♡'}
                                            </button>

                                            <span className="product-category">
                                                {product.category}
                                            </span>

                                            <Link
                                                to={`/product/${product.id}`}
                                                className="product-name-link"
                                            >
                                                <h3>{product.name}</h3>
                                            </Link>

                                            <p className="product-description">
                                                {product.description}
                                            </p>

                                            <div className="product-rating">
                                                <span>★</span> {product.rating}
                                                <span className="rating-text">
                                                    Customer rating
                                                </span>
                                            </div>

                                            <div className="product-bottom">
                                                <strong className="price">
                                                    ₹{product.price.toLocaleString('en-IN')}
                                                </strong>

                                                <button
                                                    className="add-cart-button"
                                                    onClick={() => addToCart(product)}
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="no-products">
                                    <span>🔎</span>
                                    <h3>No products found</h3>
                                    <p>Try another search or choose a different category.</p>

                                    <button
                                        onClick={() => {
                                            setSearch('')
                                            setSelectedCategory('All')
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="promo-section">
                    <div className="promo-content">
                        <span>YOUR SHOPPING, YOUR WAY</span>
                        <h2>Find something you'll love.</h2>
                        <p>
                            Explore our collection and make every shopping
                            experience a little more special.
                        </p>
                        <a href="#products" className="promo-button">
                            Start Exploring →
                        </a>
                    </div>
                    <div className="promo-decoration">🛍️</div>
                </section>

                <section className="cart-section section-container" id="cart">
                    <div className="section-heading cart-heading">
                        <div>
                            <span className="section-tag">YOUR SELECTION</span>
                            <h2>Shopping Cart</h2>
                            <p>Review the products you've selected.</p>
                        </div>

                        <span className="cart-items-label">
                            {cartCount} {cartCount === 1 ? 'item' : 'items'}
                        </span>
                    </div>

                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <span>🛒</span>
                            <h3>Your cart is waiting!</h3>
                            <p>You haven't added any products yet.</p>
                            <a href="#products" className="shop-button">
                                Start Shopping →
                            </a>
                        </div>
                    ) : (
                        <div className="cart-layout">
                            <div className="cart-list">
                                {cart.map((item) => (
                                    <div className="cart-item" key={item.id}>
                                        <img src={item.image} alt={item.name} />

                                        <div className="cart-item-details">
                                            <span>{item.category}</span>
                                            <h3>{item.name}</h3>
                                            <p>
                                                ₹{item.price.toLocaleString('en-IN')}
                                            </p>

                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    aria-label={`Decrease ${item.name} quantity`}
                                                >
                                                    −
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    onClick={() => increaseQuantity(item.id)}
                                                    aria-label={`Increase ${item.name} quantity`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="cart-item-end">
                                            <strong>
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </strong>

                                            <button
                                                className="remove-button"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <aside className="cart-summary">
                                <h3>Order Summary</h3>

                                <div className="summary-row">
                                    <span>Items ({cartCount})</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="summary-row">
                                    <span>Delivery</span>
                                    <span className="free-delivery">Free</span>
                                </div>

                                <div className="summary-total">
                                    <span>Total</span>
                                    <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                                </div>

                                <Link to="/checkout" className="continue-shopping">
                                    Proceed to Checkout →
                                </Link>
                            </aside>
                        </div>
                    )}
                </section>
            </main>

            <footer className="footer" id="footer">
                <div className="footer-main">
                    <div className="footer-brand">
                        <h2>ShopEase<span>.</span></h2>
                        <p>
                            Making online shopping simple, enjoyable
                            and convenient for everyone.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h3>Explore</h3>
                        <Link to="/">Home</Link>
                        <a href="#categories">Categories</a>
                        <a href="#products">Products</a>
                        <Link to="/cart">Shopping Cart</Link>
                    </div>

                    <div className="footer-links">
                        <h3>ShopEase</h3>
                        <a href="#footer">About Us</a>
                        <a href="#footer">Contact</a>
                        <a href="#footer">Help & Support</a>
                    </div>

                    <div className="footer-contact">
                        <h3>Stay Connected</h3>
                        <p>Thanks for visiting ShopEase!</p>
                        <div className="social-icons">
                            <span>📘</span>
                            <span>📸</span>
                            <span>💬</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 ShopEase. All rights reserved.</p>
                    <p>Made with care for a better shopping experience. 💗</p>
                </div>
            </footer>
        </div>
    )
}

function ProtectedRoute({ user, children, adminOnly = false }) {
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ message: 'Please log in to continue.' }}
            />
        )
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children
}

function App() {
    const [cart, setCart] = useState([])
    const [wishlist, setWishlist] = useState([])
    const [products, setProducts] = useState([])
    const [productsStatus, setProductsStatus] = useState('loading')

    const getSavedUser = () => {
        try {
            return JSON.parse(localStorage.getItem('shopEaseUser')) || null
        } catch {
            return null
        }
    }

    const [currentUser, setCurrentUser] = useState(getSavedUser)

    const handleLogout = () => {
        localStorage.removeItem('shopEaseToken')
        localStorage.removeItem('shopEaseUser')
        setCurrentUser(null)
        window.location.href = '/'
    }

    useEffect(() => {
        const updateUser = () => {
            setCurrentUser(getSavedUser())
        }

        window.addEventListener('shopEaseAuthChanged', updateUser)
        window.addEventListener('storage', updateUser)

        return () => {
            window.removeEventListener('shopEaseAuthChanged', updateUser)
            window.removeEventListener('storage', updateUser)
        }
    }, [])

    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: '',
        stock: ''
    })

    const handleChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(
                'http://localhost:5000/api/products',
                {
                    ...newProduct,
                    price: Number(newProduct.price),
                    stock: Number(newProduct.stock)
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('shopEaseToken')}`
                    }
                }
            )

            const savedProduct = {
                ...response.data,
                id: response.data._id,
                rating: response.data.rating || 4.8,
                tag: response.data.tag || 'New'
            }

            setProducts((previousProducts) => [
                ...previousProducts,
                savedProduct
            ])

            setNewProduct({
                name: '',
                price: '',
                description: '',
                category: '',
                image: '',
                stock: ''
            })

            alert('Product added successfully!')
        } catch (error) {
            console.error('Error adding product:', error)
            alert(
                error.response?.data?.message ||
                'Unable to add product. Please try again.'
            )
        }
    }

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then((response) => {
                setProducts(
                    response.data.map((product) => ({
                        ...product,
                        id: product._id,
                        rating: product.rating || 4.8,
                        tag: product.tag || 'New',
                    }))
                )

                setProductsStatus('success')
                console.log('Products fetched successfully:', response.data)
            })
            .catch((error) => {
                console.error('Error fetching products:', error)
                setProductsStatus('error')
            })
    }, [])

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <HomePage
                        cart={cart}
                        setCart={setCart}
                        wishlist={wishlist}
                        setWishlist={setWishlist}
                        products={products}
                        currentUser={currentUser}
                        onLogout={handleLogout}
                    />
                }
            />

            <Route
                path="/product/:id"
                element={
                    <ProductDetails
                        cart={cart}
                        setCart={setCart}
                        products={products}
                        productsStatus={productsStatus}
                    />
                }
            />

            <Route
                path="/cart"
                element={
                    <CartPage cart={cart} setCart={setCart} />
                }
            />

            <Route
                path="/checkout"
                element={
                    <ProtectedRoute user={currentUser}>
                        <Checkout cart={cart} />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/order-success"
                element={
                    <ProtectedRoute user={currentUser}>
                        <OrderSuccess />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/wishlist"
                element={
                    <Wishlist
                        wishlist={wishlist}
                        setWishlist={setWishlist}
                        setCart={setCart}
                    />
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute user={currentUser}>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute user={currentUser} adminOnly>
                        <Admin
                            products={products}
                            setProducts={setProducts}
                            newProduct={newProduct}
                            setNewProduct={setNewProduct}
                            handleChange={handleChange}
                            handleAddProduct={handleAddProduct}
                        />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default App
