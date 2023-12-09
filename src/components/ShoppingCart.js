import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Cart.css'; // Make sure you have the appropriate CSS for styling

function ShoppingCart({ cartItems = [], removeFromCart }) {
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const TAX_RATE = 0.13;

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    const calculateTotal = () => {
        return total.toFixed(2);
    };

    return (
        <div>
            <h2>Your Cart</h2>
            <div className="shopping-cart-container">
                <div className="shopping-cart">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <div className="cart-item-image">
                                    <img style={{ width: '100px' }} src={`http://localhost:3001/${item.image}`} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p>Price: ${item.price.toFixed(2)}</p>
                                    <div className="cart-item-actions">
                                        <button onClick={() => removeFromCart(item._id)}>Remove</button>
                                    </div>
                                </div>
                                <div className="cart-item-quantity">
                                    <label htmlFor="quantity">Quantity:</label>
                                    <input type="number" id="quantity" name="quantity" value={item.quantity} min="1" />
                                </div>
                                <div className="cart-item-total">
                                    <p>Total: ${(item.quantity * item.price).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Summary</h3>
                        <div className="cart-total">
                            <p>Total: ${calculateTotal()}</p>
                        </div>
                        <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;
