
import { Link } from 'react-router-dom'

function Wishlist({ wishlist, setWishlist, setCart }) {

    const removeFromWishlist = (productId) => {
        setWishlist((previous) =>
            previous.filter((item) => item.id !== productId)
        )
    }

    const addToCart = (product) => {
        setCart((previous) => {
            const existingItem = previous.find(
                (item) => item.id === product.id
            )

            if (existingItem) {
                return previous.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            return [...previous, { ...product, quantity: 1 }]
        })

        alert(`${product.name} added to cart!`)
    }

    return (
        <div className="wishlist-page">

            <h1>My Wishlist ❤️</h1>

            <p className="wishlist-subtitle">
                Your favourite products, all in one place.
            </p>

            {wishlist.length === 0 ? (
                <div className="empty-wishlist">
                    <h2>Your wishlist is empty!</h2>
                    <p>Save products you love and find them here.</p>

                    <Link to="/" className="wishlist-shop-button">
                        Explore Products →
                    </Link>
                </div>
            ) : (
                <div className="wishlist-grid">

                    {wishlist.map((product) => (
                        <div className="wishlist-card" key={product.id}>

                            <img
                                src={product.image}
                                alt={product.name}
                            />

                            <div className="wishlist-card-content">

                                <h3>{product.name}</h3>

                                <p>
                                    ₹{product.price.toLocaleString('en-IN')}
                                </p>

                                <button
                                    onClick={() => addToCart(product)}
                                    className="wishlist-cart-button"
                                >
                                    Add to Cart
                                </button>

                                <button
                                    onClick={() =>
                                        removeFromWishlist(product.id)
                                    }
                                    className="wishlist-remove-button"
                                >
                                    Remove ❤️
                                </button>

                            </div>
                        </div>
                    ))}

                </div>
            )}

            <Link to="/" className="wishlist-back-home">
                ← Continue Shopping
            </Link>

        </div>
    )
}

export default Wishlist
