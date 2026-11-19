
import { useState } from 'react'
import { Link } from 'react-router-dom'

const getSavedProfile = () => {
    const savedCustomer = localStorage.getItem('shopEaseCustomer')

    if (savedCustomer) {
        const customer = JSON.parse(savedCustomer)

        return {
            name: customer.fullName || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
            city: customer.city || '',
            pincode: customer.pincode || '',
        }
    }

    return {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
    }
}

function Profile() {
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState(getSavedProfile)

    const handleChange = (event) => {
        const { name, value } = event.target

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    const handleSave = (event) => {
        event.preventDefault()

        const customer = {
            fullName: profile.name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            pincode: profile.pincode,
        }

        localStorage.setItem(
            'shopEaseCustomer',
            JSON.stringify(customer)
        )

        setIsEditing(false)
        alert('Profile updated successfully!')
    }

    const handleCancel = () => {
        setProfile(getSavedProfile())
        setIsEditing(false)
    }

    return (
        <div className="profile-page">
            <div className="profile-container">

                <h1>My Profile 👤</h1>
                <p className="profile-subtitle">
                    Manage your personal information and delivery details.
                </p>

                <div className="profile-card">

                    <div className="profile-header">
                        <div className="profile-avatar">👤</div>
                        <div>
                            <h2>{profile.name || 'Your Name'}</h2>
                            <p>ShopEase Customer</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave}>

                        <h3>Personal Information</h3>

                        <div className="profile-form-grid">

                            <div className="profile-field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>

                        </div>

                        <h3>Delivery Information</h3>

                        <div className="profile-form-grid">

                            <div className="profile-field full-width">
                                <label>Delivery Address</label>
                                <textarea
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter your address"
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={profile.city}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label>PIN Code</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={profile.pincode}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter PIN code"
                                    maxLength="6"
                                    required
                                />
                            </div>

                        </div>

                        <div className="profile-actions">

                            {isEditing ? (
                                <>
                                    <button
                                        type="submit"
                                        className="profile-save-button"
                                    >
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        className="profile-cancel-button"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="profile-edit-button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}

                        </div>

                    </form>
                </div>

                <Link to="/" className="profile-back-home">
                    ← Continue Shopping
                </Link>

            </div>
        </div>
    )
}

export default Profile
