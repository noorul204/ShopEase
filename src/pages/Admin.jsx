
import { useEffect, useState } from 'react'
import axios from 'axios'

function Admin() {
    const [products, setProducts] = useState([])

    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: '',
        stock: ''
    })

    const [editingId, setEditingId] = useState(null)

    const [editProduct, setEditProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: '',
        stock: ''
    })

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                'http://localhost:5000/api/products'
            )
            setProducts(response.data)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()

        try {
            await axios.post(
                'http://localhost:5000/api/products',
                {
                    ...newProduct,
                    price: Number(newProduct.price),
                    stock: Number(newProduct.stock)
                }
            )

            setNewProduct({
                name: '',
                price: '',
                description: '',
                category: '',
                image: '',
                stock: ''
            })

            await fetchProducts()
            alert('Product added successfully!')
        } catch (error) {
            console.error('Error adding product:', error)
            alert('Unable to add product. Please try again.')
        }
    }

    const handleEditClick = (product) => {
        setEditingId(product._id)

        setEditProduct({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
            stock: product.stock
        })
    }

    const handleEditChange = (e) => {
        setEditProduct({
            ...editProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdateProduct = async (e) => {
        e.preventDefault()

        try {
            await axios.put(
                `http://localhost:5000/api/products/${editingId}`,
                {
                    ...editProduct,
                    price: Number(editProduct.price),
                    stock: Number(editProduct.stock)
                }
            )

            setEditingId(null)
            await fetchProducts()
            alert('Product updated successfully!')
        } catch (error) {
            console.error('Error updating product:', error)
            alert('Unable to update product. Please try again.')
        }
    }

    const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this product?'
        )

        if (!confirmDelete) return

        try {
            await axios.delete(
                `http://localhost:5000/api/products/${id}`
            )

            await fetchProducts()
            alert('Product deleted successfully!')
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Unable to delete product. Please try again.')
        }
    }

    return (
        <div className="admin-page">
            <h1>ShopEase Admin Dashboard</h1>
            <p>Manage your store products here.</p>

            <h2>Add New Product</h2>

            <form onSubmit={handleAddProduct}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                />

                <textarea
                    name="description"
                    placeholder="Product Description"
                    value={newProduct.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={handleChange}
                    required
                />

                <input
                    type="url"
                    name="image"
                    placeholder="Product Image URL"
                    value={newProduct.image}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock Quantity"
                    value={newProduct.stock}
                    onChange={handleChange}
                    required
                    min="0"
                />

                <button type="submit">Add Product</button>
            </form>

            <h2>All Products ({products.length})</h2>

            {products.map((product) => (
                <div key={product._id} className="admin-product">
                    <h3>{product.name}</h3>
                    <p>Price: ₹{product.price}</p>
                    <p>Category: {product.category}</p>
                    <p>Stock: {product.stock}</p>

                    <button
                        type="button"
                        onClick={() => handleEditClick(product)}
                    >
                        Edit Product
                    </button>

                    <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                    >
                        Delete Product
                    </button>

                    {editingId === product._id && (
                        <form onSubmit={handleUpdateProduct}>
                            <h3>Edit Product</h3>

                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={editProduct.name}
                                onChange={handleEditChange}
                                required
                            />

                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={editProduct.price}
                                onChange={handleEditChange}
                                required
                                min="0.01"
                                step="0.01"
                            />

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={editProduct.description}
                                onChange={handleEditChange}
                                required
                            />

                            <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                value={editProduct.category}
                                onChange={handleEditChange}
                                required
                            />

                            <input
                                type="url"
                                name="image"
                                placeholder="Image URL"
                                value={editProduct.image}
                                onChange={handleEditChange}
                                required
                            />

                            <input
                                type="number"
                                name="stock"
                                placeholder="Stock"
                                value={editProduct.stock}
                                onChange={handleEditChange}
                                required
                                min="0"
                            />

                            <button type="submit">
                                Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditingId(null)}
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Admin
