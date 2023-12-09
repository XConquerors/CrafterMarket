import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/pdp.css';

function ProductDetail({ addToCart , userId }) {
    console.log("user id : ", userId);
    const [product, setProduct] = useState(null);
    const { productId } = useParams();

    useEffect(() => {
        fetch(`http://localhost:3001/products/${productId}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
        }
    };

    const addToWishlist = async () => {
        if (!userId) {
            console.error('User ID is missing'); // Handling case when userId is missing
            alert('Please log in to add items to your wishlist');
            return;
        }
        try {
            await axios.post('http://localhost:3001/wishlist/add', { userId, productId: product._id });
            alert('Product added to wishlist');
        } catch (error) {
            console.error('Error adding to wishlist', error);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        < div className="product-container" >
            <div className="product-image">
                {/* Your product image will go here */}
                <img src={`http://localhost:3001/${product.image}`} alt={product.name} />
            </div>
            <div className="product-details">
                {/* Product details will go here */}
                <h1 className="product-title">{product.name}</h1>
                <div className="product-meta">
                    <span className="product-category">{product.category}</span> |
                    <span className="product-sku">SKU: {product.sku}</span>
                </div>
                <div className="product-price">
                    <strong>Price:</strong> ${product.price}
                </div>
                <div className="product-stock">
                    <strong>Stock:</strong> <span className="in-stock">In stock</span>
                </div>
                <div className="product-quantity">
                    <strong>Quantity:</strong>
                    {/* Quantity incrementer will go here */}
                </div>
                <div>
                <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
                <button className="wishlist-button" onClick={addToWishlist}>Add to Wishlist</button>
                </div>
            </div>
        </div >

    );
}

export default ProductDetail;
