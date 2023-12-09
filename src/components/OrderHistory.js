import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/OrderHistory.css'

function OrderHistory({ userId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/orders/${userId}`);
        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders', error);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <div className="order-history">
        <h2>Order History</h2>
        {orders.map(order => (
            <div key={order._id} className="order-item">
                <h3>Order ID: {order._id}</h3>
                <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                
                <p className="total-cost">Total Cost: ${order.totalCost}</p>
                <div className="products-list">
                    {order.items.map((item, index) => (
                        <div key={index} className="product-item">
                            <p>{item.name}</p>
                            <img style={{ width: '100px' }} src={`http://localhost:3001/${item.image}`} alt={item.name} />
                            <p>Price: ${item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Subtotal: ${item.price * item.quantity}</p>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);
}

export default OrderHistory;
