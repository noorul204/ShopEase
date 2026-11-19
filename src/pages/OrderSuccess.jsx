
import { Link, useLocation } from 'react-router-dom'

function OrderSuccess() {
    const location = useLocation()
    const order = location.state?.order

    if (!order) {
        return (
            <div className="order-success-page">
                <div className="success-card">
                    <h2>No order details found</h2>
                    <p>Please place an order first.</p>
                    <Link to="/" className="success-home-button">
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="order-success-page">
            <div className="success-card">

                <div className="success-icon">✓</div>

                <h1>Order Placed Successfully!</h1>

                <p className="success-message">
                    Thank you for shopping with ShopEase.
                    Your order has been received!
                </p>

                <div className="order-id">
                    <span>Order ID</span>
                    <strong>{order.orderId}</strong>
                </div>

                <h2>Order Summary</h2>

                {order.items.map((item) => (
                    <div className="success-order-item" key={item.id}>
                        <span>
                            {item.name} × {item.quantity}
                        </span>

                        <strong>
                            ₹{(
                                item.price * item.quantity
                            ).toLocaleString('en-IN')}
                        </strong>
                    </div>
                ))}

                <div className="success-total">
                    <strong>Total Paid</strong>
                    <strong>
                        ₹{order.total.toLocaleString('en-IN')}
                    </strong>
                </div>

                <div className="delivery-details">
                    <h2>Delivery Information</h2>

                    <p><strong>{order.customer.fullName}</strong></p>
                    <p>{order.customer.address}</p>
                    <p>
                        {order.customer.city} - {order.customer.pincode}
                    </p>
                    <p>{order.customer.phone}</p>
                    <p>{order.customer.email}</p>
                </div>

                <Link to="/" className="success-home-button">
                    Continue Shopping →
                </Link>

            </div>
        </div>
    )
}

export default OrderSuccess
