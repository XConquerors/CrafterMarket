import React, { useState } from 'react';
import '../css/AddProduct.css';

function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); // assuming it's a URL for simplicity
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [sku, setSKU] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shippingInfo, setShippingInfo] = useState('');
  const [availability, setAvailability] = useState('');
  const [sellerInfo, setSellerInfo] = useState('');
  const [reviews, setReviews] = useState(''); // assuming it's a text field for simplicity
  const [rating, setRating] = useState('');  // assuming it's a number between 1-5
  const [productURL, setProductURL] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', imageFile);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('sku', sku);
    formData.append('quantity', quantity);
    formData.append('category', category);
    formData.append('availability', availability);
    formData.append('sellerInfo', sellerInfo);
    formData.append('reviews', reviews);
    formData.append('rating', rating);
    formData.append('productURL', productURL);
    const productDetails = {
      name, description, image, price, category, tags, sku,
      quantity, shippingInfo, availability, sellerInfo, reviews,
      rating, productURL
    };

    const response = await fetch('http://localhost:3001/add-product', {
      method: 'POST',
      body: formData,
      // headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(productDetails)
    });
    const data = await response.json();
    // Handle the response data as needed

    if (data.message === 'Product added!') {
      setSuccessMessage('Product added successfully!');

      // Reset all input fields
      setName('');
      setDescription('');
      setImage('');
      setPrice('');
      setCategory('');
      setTags('');
      setSKU('');
      setQuantity('');
      setShippingInfo('');
      setAvailability('');
      setSellerInfo('');
      setReviews('');
      setRating('');
      setProductURL('');
    }
  };

  return (
    <div className="add-product-form">
      <h2>Add Product</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Product Description</label>
          <textarea
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Product Image URL</label>
          <input
            type="url"
            placeholder="Enter image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Product Image:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>Product Price</label>
          <input
            type="number"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            placeholder="Enter tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Product SKU</label>
          <input
            placeholder="Enter SKU"
            value={sku}
            onChange={(e) => setSKU(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Shipping Information</label>
          <input
            placeholder="Enter shipping information"
            value={shippingInfo}
            onChange={(e) => setShippingInfo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value === 'true')}
          >
            <option value="true">Available</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        <div className="form-group">
          <label>Seller Information</label>
          <input
            placeholder="Enter seller information"
            value={sellerInfo}
            onChange={(e) => setSellerInfo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Reviews</label>
          <textarea
            placeholder="Enter reviews"
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Rating</label>
          <input
            type="number"
            placeholder="Enter rating (1-5)"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Product URL</label>
          <input
            type="url"
            placeholder="Enter product URL"
            value={productURL}
            onChange={(e) => setProductURL(e.target.value)}
          />
        </div>

        <div className="form-group">
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
