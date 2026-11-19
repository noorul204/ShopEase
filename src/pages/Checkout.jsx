
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Checkout({ cart }) {
    const navigate = useNavigate()

    // Get logged-in user
    const savedUser = JSON.parse(
        localStorage.getItem('shopEaseUser') || 'null'
    )

    const [customer, setCustomer] = useState({
        fullName: savedUser?.name || '',
        email: savedUser?.email || '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
    })

    const [pincodeInfo, setPincodeInfo] = useState('')
    const [pincodeLoading, setPincodeLoading] = useState(false)
    const [orderSaving, setOrderSaving] = useState(false)

    // Handle customer input changes
    const handleChange = (e) => {
        const { name, value } = e.target

        setCustomer((previous) => ({
            ...previous,
            [name]: value,
        }))

        if (name === 'pincode') {
            setPincodeInfo('')
        }
    }

    // Verify PIN code
    const verifyPincode = async () => {
        const pin = customer.pincode.trim()

        if (!/^[0-9]{6}$/.test(pin)) {
            setPincodeInfo({
                message: 'Please enter a valid 6-digit PIN code.',
                valid: false,
            })
            return
        }

        try {
            setPincodeLoading(true)
            setPincodeInfo('')

            const response = await fetch(
                `https://api.postalpincode.in/pincode/${pin}`
            )

            if (!response.ok) {
                throw new Error('PIN lookup failed')
            }

            const result = await response.json()
            const postalData = result[0]

            if (
                postalData.Status !== 'Success' ||
                !postalData.PostOffice ||
                postalData.PostOffice.length === 0
            ) {
                setPincodeInfo({
                    message: 'This PIN code was not found.',
                    valid: false,
                })
                return
            }

            const firstOffice = postalData.PostOffice[0]

            setPincodeInfo({
                message: `PIN verified! ${firstOffice.District}, ${firstOffice.State}`,
                valid: true,
                district: firstOffice.District,
                state: firstOffice.State,
                officeNames: postalData.PostOffice.map(
                    (office) => office.Name.toLowerCase()
                ),
            })

            setCustomer((previous) => ({
                ...previous,
                city: previous.city || firstOffice.District,
            }))

        } catch (error) {
            setPincodeInfo({
                message: 'Unable to verify PIN code. Please try again.',
                valid: false,
            })
        } finally {
            setPincodeLoading(false)
        }
    }

    // Submit order and save it in MongoDB
    const handleSubmit = async () => {
        if (
            !customer.fullName.trim() ||
            !customer.email.trim() ||
            !customer.phone.trim() ||
            !customer.address.trim() ||
            !customer.city.trim() ||
            !customer.pincode.trim()
        ) {
            alert('Please fill in all delivery details.')
            return
        }

        if (cart.length === 0) {
            alert('Your cart is empty.')
            return
        }

        if (customer.address.trim().length < 10) {
            alert('Please enter a complete delivery address.')
            return
        }

        if (!/^[A-Za-z\s.'-]+$/.test(customer.city.trim())) {
            alert('Please enter a valid city name.')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
            alert('Please enter a valid email address.')
            return
        }

        if (!/^[0-9]{10}$/.test(customer.phone)) {
            alert('Please enter a valid 10-digit phone number.')
            return
        }

        if (!/^[0-9]{6}$/.test(customer.pincode)) {
            alert('Please enter a valid 6-digit PIN code.')
            return
        }

        // Check login token
        const token = localStorage.getItem('shopEaseToken')

        if (!token) {
            alert('Your login session has expired. Please log in again.')
            navigate('/login')
            return
        }

        try {
            setOrderSaving(true)

            const response = await fetch(
                'http://localhost:5000/api/orders',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        customer: {
                            ...customer,
                            fullName: customer.fullName.trim(),
                            email: customer.email.trim().toLowerCase(),
                            address: customer.address.trim(),
                            city: customer.city.trim(),
                            pincode: customer.pincode.trim(),
                        },
                        items: cart.map((item) => ({
                            id: String(item.id),
                            name: item.name,
                            price: Number(item.price),
                            quantity: Number(item.quantity),
                        })),
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to place order.'
                )
            }

            localStorage.setItem(
                'shopEaseCustomer',
                JSON.stringify(customer)
            )

            navigate('/order-success', {
                state: { order: data.order },
            })

        } catch (error) {
            alert(
                error.message || 'Something went wrong. Please try again.'
            )
        } finally {
            setOrderSaving(false)
        }
    }

    // Calculate total
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <p className="checkout-subtitle">
                Complete your details to place your order.
            </p>

            <div className="checkout-container">

                <div className="checkout-form">
                    <h2>Delivery Information</h2>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={customer.fullName}
                            onChange={handleChange}
                        />

                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={customer.email}
                            onChange={handleChange}
                        />

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={customer.phone}
                            onChange={handleChange}
                        />

                        <label>Delivery Address</label>
                        <textarea
                            name="address"
                            placeholder="Enter your full address"
                            value={customer.address}
                            onChange={handleChange}
                        />

                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            placeholder="Enter your city"
                            value={customer.city}
                            onChange={handleChange}
                        />

                        <label>PIN Code</label>
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Enter your 6-digit PIN code"
                            value={customer.pincode}
                            onChange={handleChange}
                            onBlur={verifyPincode}
                        />

                        {pincodeLoading && (
                            <p>Verifying PIN code...</p>
                        )}

                        {pincodeInfo && (
                            <p
                                style={{
                                    color: pincodeInfo.valid
                                        ? 'green'
                                        : 'red',
                                    marginTop: '-12px',
                                    marginBottom: '15px',
                                    fontSize: '14px',
                                }}
                            >
                                {pincodeInfo.message}
                            </p>
                        )}
                    </form>
                </div>

                <div className="checkout-summary">
                    <h2>Order Summary</h2>

                    {cart.map((item) => (
                        <div
                            className="checkout-item"
                            key={item.id}
                        >
                            <span>
                                {item.name} × {item.quantity}
                            </span>

                            <span>
                                ₹{(
                                    item.price * item.quantity
                                ).toLocaleString('en-IN')}
                            </span>
                        </div>
                    ))}

                    <div className="checkout-total">
                        <strong>Total Amount</strong>

                        <strong>
                            ₹{total.toLocaleString('en-IN')}
                        </strong>
                    </div>

                    <button
                        className="place-order-button"
                        type="button"
                        onClick={handleSubmit}
                        disabled={orderSaving}
                    >
                        {orderSaving
                            ? 'Placing Order...'
                            : 'Place Order'}
                    </button>

                    <Link to="/cart" className="back-cart">
                        ← Back to Cart
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Checkout
