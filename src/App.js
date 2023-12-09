import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import AddProduct from './components/AddProduct';
import ProductDetail from './components/ProductDetail';
import ProductList from './components/ProductList';
import Login from './components/Login';
import Signup from './components/Signup';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import RealTimeChat from './components/RealTimeChat';
import Wishlist from './components/Wishlist';
import OrderHistory from './components/OrderHistory';
import EventPost from './components/EventPost';
import EventList from './components/EventList';
import { AuthProvider } from './AuthContext';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  const addToCart = (product) => {
    console.log("Adding to cart:", product);
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId) => {
    console.log("Removing from cart:", productId);
    const updatedCart = cartItems.filter((item) => item._id !== productId);
    setCartItems(updatedCart);
  };

  useEffect(() => {
    console.log("isLoggedIn value:", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      setRedirectToHome(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (redirectToHome) {
      setRedirectToHome(false);  // Reset the state after navigation
    }
  }, [redirectToHome]);

  const handleLogin = async (inputUsername, inputPassword) => {
    setError(''); // Reset error message
    if (inputUsername === '' || inputPassword === '') {
      setError('Both fields are required.');
      return;
    }
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUsername, password: inputPassword }),
    });
    const data = await response.json();
    setMessage(data.message);
    console.log("Server Response:", data);

    if (data.message === 'Logged in successfully') {
      setIsLoggedIn(true);
      setUsername(inputUsername);
      setPassword(inputPassword);
      const loggedInUserId = data.user._id;
      setUserId(loggedInUserId);
      localStorage.setItem('userId', loggedInUserId);
      setRedirectToHome(true);
    }

  };

  useEffect(() => {
    // Retrieve userId from localStorage on component mount
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSignup = async (username, password) => {
    setError(''); // Reset error message
    if (username === '' || password === '') {
      setError('Both fields are required.');
      return;
    }

    fetch('http://localhost:3001/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        if (data.message === "User registered!") {
          handleLogin(username, password);
        }
      })
      .catch(error => {
        console.error("There was an error with the fetch request:", error);
      });
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.message) {
          setIsLoggedIn(false);
          setUsername('');
          setPassword('');
          setMessage(data.message);

          window.location.href = '/login';
        }
      } else {
        console.error("Unexpected response:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header key={isLoggedIn.toString()} isLoggedIn={isLoggedIn} handleLogout={handleLogout} cartItems={cartItems} removeFromCart={removeFromCart} username={username} />
          <div className="contentContainer">

            {redirectToHome && <Navigate to="/home" />}
            <Routes>
              <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
              <Route path="/login" element={<Login handleLogin={handleLogin} error={error} message={message} />} />
              <Route path="/signup" element={<Signup handleSignup={handleSignup} error={error} message={message} />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/product-list" element={<ProductList addToCart={addToCart} />} />
              <Route path="/product/:productId" element={<ProductDetail userId={userId} addToCart={addToCart} />} />
              <Route path="/cart" element={<ShoppingCart cartItems={cartItems} removeFromCart={removeFromCart} />} />
              <Route path="/checkout" element={<Checkout cartItems={cartItems} userId={userId} setCartItems={setCartItems} />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/chat" element={<RealTimeChat />} />
              <Route path="/wishlist" element={<Wishlist userId={userId} />} />
              <Route path="/order-history" element={<OrderHistory userId={userId} />} />
              <Route path="/add-event" element={<EventPost userId={userId} />} />
              <Route path="/events" element={<EventList userId={userId} />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
