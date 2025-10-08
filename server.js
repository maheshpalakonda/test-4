const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const { Customer, Seller, Admin, Product, Order } = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Connect to MongoDB
mongoose.connect('mongodb+srv://maheshpalakunda_db_user:Mahesh1925@cluster0.mh9hkoh.mongodb.net/shopnest?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Serve the main HTML file for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'add to cart.html'));
});

// Serve other HTML files as needed
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, page);
    
    // Check if file exists with .html extension
    if (require('fs').existsSync(filePath)) {
        res.sendFile(filePath);
    } else if (require('fs').existsSync(filePath + '.html')) {
        res.sendFile(filePath + '.html');
    } else {
        // If file doesn't exist, serve the main page
        res.sendFile(path.join(__dirname, 'add to cart.html'));
    }
});

// Customer Registration
app.post('/register/customer', async (req, res) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({ error: true, message: 'Passwords do not match' });
        }

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ error: true, message: 'Customer already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = new Customer({
            fullname,
            email,
            password: hashedPassword
        });

        await customer.save();
        res.json({ error: false, message: 'Customer registered successfully' });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Server error during registration' });
    }
});

// Customer Login
app.post('/login/customer', async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email });
        
        if (!customer) {
            return res.status(400).json({ error: true, message: 'Customer not found' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ error: true, message: 'Invalid password' });
        }

        res.json({ 
            error: false, 
            message: 'Login successful',
            user: {
                id: customer._id,
                fullname: customer.fullname,
                email: customer.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Server error during login' });
    }
});

// Seller Registration
app.post('/register/seller', async (req, res) => {
    try {
        const { fullname, business_name, business_type, email, password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({ error: true, message: 'Passwords do not match' });
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ error: true, message: 'Seller already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const seller = new Seller({
            fullname,
            business_name,
            business_type,
            email,
            password: hashedPassword
        });

        await seller.save();
        res.json({ error: false, message: 'Seller registered successfully' });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Server error during registration' });
    }
});

// Seller Login
app.post('/login/seller', async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Seller.findOne({ email });
        
        if (!seller) {
            return res.status(400).json({ error: true, message: 'Seller not found' });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(400).json({ error: true, message: 'Invalid password' });
        }

        res.json({ 
            error: false, 
            message: 'Login successful',
            seller: {
                id: seller._id,
                fullname: seller.fullname,
                business_name: seller.business_name,
                email: seller.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Server error during login' });
    }
});

// Admin Registration
app.post('/register/admin', async (req, res) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({ error: true, message: 'Passwords do not match' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: true, message: 'Admin already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({
            fullname,
            email,
            password: hashedPassword
        });

        await admin.save();
        res.json({ error: false, message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Server error during registration' });
    }
});

// Admin Login
app.post('/login/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.status(400).json({ error: true, message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: true, message: 'Invalid password' });
        }

        res.json({ 
            error: false, 
            message: 'Login successful',
            admin: {
                id: admin._id,
                fullname: admin.fullname,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Server error during login' });
    }
});

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Error fetching products' });
    }
});

// Create order
app.post('/orders', async (req, res) => {
    try {
        const { customerId, items, totalAmount, deliveryOption, address, paymentMethod } = req.body;
        
        const order = new Order({
            customerId,
            items,
            totalAmount,
[O            deliveryOption,
            address,
            paymentMethod
        });

        await order.save();
        res.json({ error: false, message: 'Order created successfully', orderId: order._id });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Error creating order' });
    }
});

// Catch-all handler - serve the main HTML file for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'add to cart.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Your application should now be accessible at http://localhost:${PORT}`);
});
