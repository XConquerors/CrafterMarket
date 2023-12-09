// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const paypal = require('@paypal/checkout-server-sdk');
const { v4: uuidv4 } = require('uuid'); // For generating unique order IDs
const http = require('http');
const socketIo = require('socket.io');
const router = express.Router();
const crypto = require('crypto');
const MongoStore = require('connect-mongo');

// require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/CrafterMarket', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
   // or your front end's origin
}));
// app.use('/images', express.static('./images'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.use(router);
const secret = crypto.randomBytes(32).toString('hex');
console.log(secret);

app.use(session({
  //process.env.SESSION_SECRET
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1800000, // Session expiration duration
  },
  //secure: process.env.NODE_ENV === 'production', httpOnly: true
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/CrafterMarket' }),
}));

const server = http.createServer(app);
const io = socketIo(server);

// Configure environment with your PayPal credentials
let environment = new paypal.core.SandboxEnvironment('ATuCDVTlXBo_q0pz8pyum-knu1w56N8RnF0tBMEGYAJEnDJIzcq3pYbMF8YVwr0YhBOUg0VsqIE2tkoR', 'EC_7cV7UFZAL2p0fUm4UJeji8Ma74yd-kO1m41lmBTR-mOltMNvxDbOG8VK3cuEuES7xEsv-AoBn-yPC');
let client = new paypal.core.PayPalHttpClient(environment);

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'images')) // Save in the 'images' directory at the root of the project
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Use Date.now() to get a unique file name
  }
})

const upload = multer({ storage: storage });

const orders = [];

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number,
  category: String,
  tags: [String],
  sku: String,
  quantity: Number,
  shippingInfo: String,
  availability: Boolean,
  sellerInfo: String,
  reviews: [String],  // Making a basic assumption, may need to be a separate schema
  rating: Number,
  productURL: String
});

const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  totalCost: Number,
  shippingDetails: Object,  // or more specific schema
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

app.post('/signup', async (req, res) => {
  console.log("Signup request received");
  try {
    const { username, password } = req.body;
    console.log(`Attempting to register user: ${username}`);
    const user = new User({ username, password });
    await user.save();
    console.log(`User ${username} registered successfully`);
    res.status(201).send({ message: 'User registered!' });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({ message: 'Both fields are required.' });
    }

    const user = await User.findOne({ username, password });
    if (user) {
      // Set the user information in the session after successful login
      req.session.user = { _id: user._id, username: username };
      req.session.save(err => {
        if (err) {
          throw err;
        }
        res.status(200).send({ message: 'Logged in successfully', user: { _id: user._id, username: username } });
      });
    } else {
      // Handle login failure
      res.status(401).send({ message: 'Login failed' });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// app.post('/logout', (req, res) => {
//   req.session.destroy(); // If you're using express-session
//   // or
//   // req.logout(); If you're using passport.js
//   // res.json({ message: "Logged out successfully." });
//   res.redirect('login');
// });


app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json({ message: "Logged out successfully." });
    });
  } else {
    res.status(200).json({ message: "Session not found. Already logged out." });
  }
});


app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.status(200).send(products);
});

app.post('/add-product', upload.single('image'), async (req, res) => {
  const { name, description, price, tags, sku,
    quantity, shippingInfo, availability, sellerInfo, reviews,
    rating, productURL } = req.body;
  let category = req.body.category;
  if (Array.isArray(category)) {
    category = category.join(', '); // or however you wish to store multiple categories
  }
  let imagePath = '';
  if (req.file) {
    // You should save the relative path from the 'images' directory
    imagePath = `images/${req.file.filename}`;
  }
  const availabilityBool = availability === 'true';
  const product = new Product({
    name, price, image: imagePath, description, category, tags, sku,
    quantity, shippingInfo, availability: availabilityBool, sellerInfo, reviews, rating, productURL
  });

  try {
    await product.save();
    res.status(201).send({ message: 'Product added!', product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.post('/capture-order', async (req, res) => {
  const request = new paypal.orders.OrdersCaptureRequest(req.body.orderID);
  request.requestBody({});

  try {
    const response = await client.execute(request);
    res.json({ status: 'success', details: response.result });
  } catch (err) {
    res.status(500).json({ status: 'error', details: err });
  }
});

app.post('/checkout', async (req, res) => {
  try {
    // Extract the payment and order details from the request body
    const { paymentDetails, deliveryDetails, cartItems } = req.body;

    // Process payment through a payment gateway (this is a placeholder)
    const paymentResult = processPayment(paymentDetails);

    if (paymentResult.success) {
      // Calculate expected delivery date (e.g., 5 days from now)
      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);

      // Create order object
      const order = {
        id: uuidv4(),
        cartItems,
        deliveryDetails,
        paymentDetails,
        totalCost: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        expectedDeliveryDate: expectedDeliveryDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        status: 'confirmed'
      };

      // Save order to the mock database
      orders.push(order);

      // Send back order confirmation and details
      res.status(200).json({
        message: 'Order successful',
        order: order
      });
    } else {
      // Handle failed payment here
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during checkout', error: error.message });
  }
});

// Mock payment processing function
function processPayment(paymentDetails) {
  // This should interact with a real payment gateway
  // For now, we just simulate a successful payment
  return { success: true };
}

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    const botResponse = generateBotResponse(message);
    io.emit('receiveMessage', botResponse); // Emit the message to all clients

    socket.emit('botMessage', botResponse);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

function generateBotResponse(userMessage) {
  // Your logic to create a response goes here
  return "Hello! I'm a bot responding to your message.";
}

// Add to Wishlist
app.post('/wishlist/add', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).send('User not found');
    }
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.status(200).send('Product added to wishlist');
  } catch (error) {
    console.error('Error in /wishlist/add:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get Wishlist
app.get('/wishlist/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('wishlist');
    if (!user) return res.status(404).send('User not found');
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Remove from Wishlist
app.post('/wishlist/remove', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Remove the productId from the user's wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).send('Product removed from wishlist');
  } catch (error) {
    console.error('Error in /wishlist/remove:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/order', async (req, res) => {
  try {
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.cartItems,
      totalCost: req.body.totalCost,
      shippingDetails: req.body.deliveryDetails
    });
    await newOrder.save();
    res.status(201).send({ message: 'Order saved successfully', order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('items');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Assuming you have required express and set up your router
// Also, make sure you have the Event model imported

router.post('/events', async (req, res) => {
  try {
    console.log(req.session);
    // if (!req.session.user) {
    //   return res.status(401).send({ message: 'User not authenticated' });
    // }
    const user = await User.findOne({ username: 'ck' });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const { title, description, date, location } = req.body;
    const event = new Event({
      title,
      description,
      date,
      location,
      createdBy: user._id
    });
    await event.save();
    res.status(201).send({ message: 'Event created successfully', event: event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'username');
    res.status(200).send(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
