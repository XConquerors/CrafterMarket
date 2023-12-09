// Wishlist.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Wishlist.css';

function Wishlist({ userId }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    console.log("Current userId:", userId);
    if (!userId) {
      console.warn('UserId not available for Wishlist');
      return; // Don't proceed if userId is not available
    }
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/wishlist/${userId}`);
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist', error);
        alert(`Error fetching wishlist: ${error.message}`);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.post('http://localhost:3001/wishlist/remove', { userId, productId });
      // Update the wishlist state
      const updatedWishlist = wishlist.filter(product => product._id !== productId);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Error removing product from wishlist', error);
    }
  };
  

  return (

    <div className="wishlist">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="empty-wishlist-placeholder">
        <p className="empty-wishlist">Your wishlist is currently empty.</p>
        <a href="/home">Browse Products</a>
      </div>
      ) : (
        <div className="wishlist-items">
          {wishlist.map(product => (
            <div key={product._id} className="wishlist-item">
              <a href={`/product/${product._id}`} className="product-link">
              <img className="product-image" src={`http://localhost:3001/${product.image}`} alt={product.name} />
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-id">ID: {product._id}</p>
              </div>
              </a>
              <button className="remove-button" onClick={() => handleRemoveFromWishlist(product._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>

  );
}

export default Wishlist;
