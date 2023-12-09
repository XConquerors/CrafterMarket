import React, { useState } from 'react';
import { useEffect } from 'react';
import ShoppingCart from './ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import '../css/MiniCart.css';
import WishlistIcon from '../images/wishlist.png';
import { useAuth } from '../AuthContext';

function Header({ cartItems, removeFromCart, username }) {
  const { user, logout } = useAuth();
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const { cartItems } = useCart();

  localStorage.setItem('isLoggedIn', true);
  localStorage.setItem('username', username);

  const navigate = useNavigate();

  const goToWishlistPage = () => {
    navigate('/wishlist'); // Make sure you have a route set up for this
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const navigateToOrderHistory = () => {
    navigate('/order-history');
  };

  useEffect(() => {
    // const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      // Set the state based on local storage
      setIsLoggedIn(true);

    }
  }, []);

  const handleLogout = () => {
    // Your logout logic
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    // Redirect to login or home page
    navigate('/login');
  };

  const handleMiniCartToggle = () => {
    setShowMiniCart(!showMiniCart);
  };

  const goToCartPage = () => {
    navigate('/cart');
    setShowMiniCart(false); // Hide mini cart when navigating away
  };

  const handleChatNavigate = () => {
    navigate('/chat'); // This will navigate to the chat page
  };

  return (
    <header>
      <nav>
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/add-product">Add Product</Link>
          <div className="cart-dropdown-container">
            <button onClick={handleMiniCartToggle}>
              Cart ({cartItems.length})
            </button>
            {showMiniCart && (
              <div className="mini-cart">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div className="mini-cart-item" key={item._id}>
                      <img style={{ width: '50px' }} src={`http://localhost:3001/${item.image}`} alt={item.name} className="mini-cart-image" />
                      <div className="mini-cart-info">
                        <div className="mini-cart-title">{item.name}</div>
                        <div className="mini-cart-price">${item.price}</div>
                      </div>
                      <div className="mini-cart-quantity">
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <button className="mini-cart-remove" onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
                <div className="mini-cart-total">
                  Total: ${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}
                </div>
                <div className="mini-cart-actions">
                  <Link to="/cart" className="view-cart-btn" onClick={() => setShowMiniCart(false)}>View cart</Link>
                  <Link to="/checkout" className="checkout-btn" onClick={() => setShowMiniCart(false)}>Checkout</Link>
                </div>
              </div>
            )}
          </div>
          <button onClick={handleChatNavigate}>Chat</button>

          <img
            src={WishlistIcon}
            alt="Wishlist"
            className="wishlist-icon"
            onClick={goToWishlistPage}
          />

          {<button onClick={navigateToOrderHistory}>Order History</button>}
          <a href="/events">View Events</a>
        </div>

        {(
          <div className="user-actions">
            {/* <button onClick={handleLogout}>Logout</button> */}
            {<button onClick={handleLogout}>Logout</button>}
            <div className="profile-icon">
              {username && username[0].toUpperCase()}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;