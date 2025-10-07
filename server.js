const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { Customer, Seller, Admin, Product, Order } = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB connection
async function connectDB() {
    try {
        await mongoose.connect(
            'mongodb+srv://maheshpalakunda_db_user:Mahesh1925@cluster0.mh9hkoh.mongodb.net/shopnest?retryWrites=true&w=majority',
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit if DB connection fails
    }
}

// Routes

// Serve main HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'add to cart.html'));
});

// Serve other HTML pages
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, page);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else if (fs.existsSync(filePath + '.html')) {
        res.sendFile(filePath + '.html');
    } else {
        res.sendFile(path.join(__dirname, 'add to cart.html'));
    }
});

// --- Customer Routes ---

app.post('/register/customer', async (req, res) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;

        if (!fullname || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: true, message: 'All fields are required' });
        }

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
        console.log('✅ Customer registered:', email);

        res.json({ error: false, message: 'Customer registered successfully' });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ error: true, message: 'Server error during registration' });
    }
});

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
        console.error('❌ Login error:', error);
        res.status(500).json({ error: true, message: 'Server error during login' });
    }
});

// --- Seller Routes ---
app.post('/register/seller', async (req, res) => {
    try {
        const { fullname, business_name, business_type, email, password, confirmPassword } = req.body;

        if (!fullname || !business_name || !business_type || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: true, message: 'All fields are required' });
        }

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
        console.log('✅ Seller registered:', email);

        res.json({ error: false, message: 'Seller registered successfully' });
    } catch (error) {
        console.error('❌ Seller registration error:', error);
        res.status(500).json({ error: true, message: 'Server error during registration' });
    }
});

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
        console.error('❌ Seller login error:', error);
        res.status(500).json({ error: true, message: 'Server error during login' });
    }
});

// --- Admin Routes ---
app.post('/register/admin', async (req, res) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;

        if (!fullname || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: true, message: 'All fields are required' });
        }

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
        console.log('✅ Admin registered:', email);

        res.json({ error: false, message: 'Admin registered successfully' });
    } catch (error) {
        console.error('❌ Admin registration error:', error);
        res.status(500).json({ error: true, message: 'Server error during registration' });
    }
});

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
        console.error('❌ Admin login error:', error);
        res.status(500).json({ error: true, message: 'Server error during login' });
    }
});

// --- Products & Orders ---
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('❌ Fetch products error:', error);
        res.status(500).json({ error: true, message: 'Error fetching products' });
    }
});

app.post('/orders', async (req, res) => {
    try {
        const { customerId, items, totalAmount, deliveryOption, address, paymentMethod } = req.body;

        const order = new Order({
            customerId,
            items,
            totalAmount,
            deliveryOption,
            address,
            paymentMethod
        });

        await order.save();
        console.log('✅ Order created:', order._id);

        res.json({ error: false, message: 'Order created successfully', orderId: order._id });
    } catch (error) {
        console.error('❌ Order creation error:', error);
        res.status(500).json({ error: true, message: 'Error creating order' });
    }
});

// Catch-all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'add to cart.html'));
});

// --- Start server after DB connection ---
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

