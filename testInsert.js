const mongoose = require('mongoose');
const { Customer } = require('./database');

mongoose.connect('mongodb+srv://maheshpalakunda_db_user:Mahesh1925@cluster0.mh9hkoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB Atlas');
    const customer = new Customer({ fullname: 'Test User', email: 'test@example.com', password: '123456' });
    await customer.save();
    console.log('Test customer inserted!');
    process.exit(0);
}).catch(err => console.error(err));
