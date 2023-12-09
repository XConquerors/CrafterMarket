import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import Header from './Header';

function HomePage() {
  
  const [cartItems, setCartItems] = useState([]);
  const [products] = useState([

  ]);

  const addToCart = (product) => {
    console.log("Added to cart. Current cart items:", cartItems);
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item._id !== productId);
    setCartItems(updatedCart);
    console.log("Updated cart items:", cartItems);
  };

  useEffect(() => {
    console.log("Updated cart items:", cartItems);
  }, [cartItems]);


  return (
    <div>

      <section className="hero">
        <h1 className="text1">.</h1>
        <p className="text1">.</p>
        <p className="text2">Discover amazing deals on a wide range of products.</p>
        <a href="#" className="btn">Shop Now</a>
      </section>

      {/* Product listings section */}
      <div>
        
        <ProductList
          products={products}
          addToCart={addToCart}
        />
      </div>
      
    </div>
  );
}

export default HomePage;
