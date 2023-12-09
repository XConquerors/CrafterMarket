import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/AddProduct.css';

function ProductList({ addToCart }) {
    const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     fetch('http://localhost:3001/products')
    //         .then(res => res.json())
    //         .then(data => setProducts(data));
    // }, []);

    useEffect(() => {
        fetch('http://localhost:3001/products')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => setProducts(data))
          .catch(error => console.error('There was a problem with the fetch operation:', error));
      }, []);

    return (
        <div>
            <h2>Products</h2>
            <div className="products-list">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <Link to={`/product/${product._id}`}>
                        <img src={`http://localhost:3001/${product.image}`} alt={product.name} />
                            <h3>{product.name}</h3>
                        </Link>
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Description:</strong> {product.description}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Tags:</strong> {product.tags}</p>
                        <p><strong>SKU:</strong> {product.sku}</p>
                        <p><strong>Quantity:</strong> {product.quantity}</p>
                        <p><strong>Shipping Info:</strong> {product.shippingInfo}</p>
                        <p><strong>Availability:</strong> {product.availability ? "Available" : "Out of Stock"}</p>
                        <p><strong>Seller:</strong> {product.sellerInfo}</p>
                        <p><strong>Reviews:</strong> {product.reviews}</p>
                        <p><strong>Rating:</strong> {product.rating} / 5</p>
                        <a href={product.productURL} target="_blank" rel="noreferrer">Product Link</a>
                        {/* <p><button onClick={() => addToCart(product)}>Add to Cart</button></p> */}
                        <p><button onClick={() => addToCart(product)}>Add to Cart</button></p>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
