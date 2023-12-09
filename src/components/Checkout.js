import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Checkout.css';

function Checkout({ cartItems, setCartItems, userId }) {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [tax, setTax] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [deliveryInfo, setDeliveryInfo] = useState({});

    // Calculate the total cost
    // Update the useEffect where you are calculating totalCost
    useEffect(() => {
        const TAX_RATE = 0.13;
        const SHIPPING_RATE = 0.2;

        const calculatedSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const calculatedTax = calculatedSubtotal * TAX_RATE;
        const calculatedShipping = calculatedSubtotal * SHIPPING_RATE;

        setSubtotal(calculatedSubtotal);
        setTax(calculatedTax);
        setShipping(calculatedShipping);
        setTotalCost(calculatedSubtotal + calculatedTax + calculatedShipping);

    }, [cartItems, paymentMethod]);

    useEffect(() => {
        if (paymentMethod === 'paypal' && window.paypal && !document.querySelector('.paypal-buttons')) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    console.log("Creating order...");
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: totalCost.toString(),
                            },
                        }],
                    });
                },
                onApprove: async (data, actions) => {
                    console.log("Order approved: ", data);
                    try {
                        const order = await actions.order.capture();
                        console.log("Order captured: ", order);
                        // Clear the cart
                        setCartItems([]); // Assuming `setCartItems` is your state setter for cart items

                        // Clear cart from local storage or any other persistent state if applicable
                        localStorage.removeItem('cartItems'); // If you're using local storage

                        // Redirect to the order success page with order details
                        navigate('/order-success', { state: { orderDetails: order } });
                        // Handle successful payment here
                    } catch (error) {
                        console.error("Error capturing order: ", error);
                    }
                },
                onError: (err) => {
                    console.error("Error with PayPal button: ", err);
                }
            }).render("#paypal-button-container");
        }
    }, [paymentMethod, totalCost]);
    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const checkoutPayload = {
            userId: userId,
            paymentDetails: paymentMethod,
            deliveryDetails: deliveryInfo,
            cartItems: cartItems,
            totalCost: totalCost,
        };

        const response = await fetch('http://localhost:3001/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutPayload),
        });

        const data = await response.json();

        if (response.ok) {
            // Clear the cart items in state
            setCartItems([]);

            // Clear the cart items in local storage or any other persistent state
            localStorage.removeItem('cartItems');

            // Navigate to the success page and pass the order details
            navigate('/order-success', { state: { orderDetails: data.order } });
        } else {
            // Handle errors here
            console.error('Checkout failed:', data.message);
        }
    };

    return (
        <form className="checkout-container" onSubmit={handleSubmit}>

            <div className="checkout-container">
                <div className="delivery-payment-container">
                    <div className="contact-info">
                        <h2>Contact</h2>
                        <input type="email" placeholder="Email" />
                        <input type="checkbox" id="emailOffers" name="emailOffers" />
                        <label htmlFor="emailOffers">Email me with news and offers</label>
                    </div>

                    <div className="delivery-info">
                        <h2>Delivery</h2>
                        <select name="country" id="country">
                            <option value="canada">Canada</option>
                            {/* Other countries */}
                        </select>
                        <input type="text" placeholder="First name (optional)" />
                        <input type="text" placeholder="Last name" />
                        <input type="text" placeholder="Address" />
                        <input type="text" placeholder="City" />
                        <select name="province" id="province">
                            <option value="ontario">Ontario</option>
                            <option value="novascotia">Nova Scotia</option>
                            <option value="alberta">Alberta</option>
                            {/* Other provinces */}
                        </select>
                        <input type="text" placeholder="Postal code" />
                        <input type="tel" placeholder="Phone (optional)" />
                    </div>

                    <div className="payment-info">
                        <h2>Payment</h2>
                        <p>All transactions are secure and encrypted.</p>
                        {/* Payment methods */}
                        <div className="payment-method">
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="payondelivery"
                                    checked={paymentMethod === 'payondelivery'}
                                    onChange={handlePaymentMethodChange}
                                />
                                Pay on Delivery
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="creditCard"
                                    checked={paymentMethod === 'creditCard'}
                                    onChange={handlePaymentMethodChange}
                                />
                                Credit card
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={handlePaymentMethodChange}
                                />
                                PayPal
                            </label>
                            {/* Additional payment methods */}
                        </div>

                        {paymentMethod === 'paypal' && <div id="paypal-button-container"></div>}
                        {paymentMethod === 'creditCard' && (
                            <div className="credit-card-details">
                                {/* The credit card form fields */}
                                <div className="form-group">
                                    <label htmlFor="cardNumber">Card number</label>
                                    <input type="text" id="cardNumber" name="cardNumber" placeholder='1234-1111-1111-1111' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Expiration date </label>
                                    <input type="text" id="expiryDate" name="expiryDate" placeholder='MM / YY' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="securityCode">Security code</label>
                                    <input type="text" id="securityCode" name="securityCode" placeholder='123' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nameOnCard">Name on card</label>
                                    <input type="text" id="nameOnCard" name="nameOnCard" placeholder='name Printed on card' />
                                </div>
                                {/* You may want to include billing address fields here as well */}
                            </div>
                        )}
                    </div>
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    {/* List of cart items */}
                    {cartItems.map((item, index) => (
                        <div className="order-item" key={index}>
                            <img style={{ width: '100px' }} src={`http://localhost:3001/${item.image}`} alt={item.name} />

                            <div>
                                <p>{item.name}</p>
                                <p>${item.price}</p>
                            </div>
                            <div>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                    {/* Total cost */}
                    <div className="total-cost">
                        <p>Subtotal: ${subtotal.toFixed(2)}</p>
                        <p>Tax: ${tax.toFixed(2)}</p>
                        <p>Shipping: ${shipping.toFixed(2)}</p>
                        <p>Total: ${totalCost.toFixed(2)}</p>
                        {/* PayPal Button or other payment gateway integration */}
                    </div>

                    <div className="pay-now-button-container">
                        <button type="submit" className="pay-now-button">
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>

        </form>
    );
}

export default Checkout;
