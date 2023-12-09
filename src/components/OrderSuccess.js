import React, { useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function OrderSuccess() {
    const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails; 
  
  // Redirect to home page after a delay or on button click
  const redirectToHome = () => {
    setTimeout(() => {
      navigate('/');
    }, 5000); // Redirect after 5 seconds
  };

  // Call the redirect function when the component mounts
  useEffect(() => {
    redirectToHome();
  }, []);

  if (!orderDetails) {
    console.error('No order details provided');
    navigate('/'); // Redirect to home or an error page
    return null; // Don't render the component
}


  return (
    <div className="order-success-container">
      <h1>Thank You for Your Order!</h1>
      <p>Your order ID is: {orderDetails.id}</p>
      <p>Your order will be delivered by: {orderDetails.expectedDeliveryDate}</p>
      <button onClick={() => navigate('/')}>Continue Shopping</button>
    </div>
  );
}

export default OrderSuccess;
