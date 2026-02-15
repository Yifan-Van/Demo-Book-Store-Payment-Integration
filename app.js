const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config(); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // read Stripe secret key from .env

var app = express();

// view engine setup (Handlebars)
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('view cache', false); // disable view caching for development
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({}));

// callback route for Stripe to create a PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
  try { // try-catch block to handle errors gracefully
    const { email, amount , shipping} = req.body;
    
    // validate input
    if (!amount || !email || !shipping) {
      return res.status(400).json({ error: 'Email, amount, and shipping details are required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount), // ensure amount is cents and a number
      currency: 'usd',
      receipt_email: email, // Key Update：customer_email → receipt_email
      shipping: shipping, // include shipping details in the payment intent creation request
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // return error message to client and log it on server for debugging
    res.status(500).json({ error: error.message });
    console.error('Stripe Payment Intent Error:', error.message); 
  }
});

/**
 * Home route
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 * Checkout route
 */
app.get('/checkout', function(req, res) {
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item;
  let title, amount, error;

  switch (item) {
    case '1':
      title = "The Art of Doing Science and Engineering"
      amount = 2300      
      break;
    case '2':
      title = "The Making of Prince of Persia: Journals 1985-1993"
      amount = 2500
      break;     
    case '3':
      title = "Working in Public: The Making and Maintenance of Open Source"
      amount = 2800  
      break;     
    default:
      // Included in layout view, feel free to assign error
      error = "No item selected"      
      break;
  }

  res.render('checkout', {
    title: title,
    amount: amount,
    error: error,
    stripePk: process.env.STRIPE_PUBLISHABLE_KEY // pass Stripe publishable key to the view for client-side use
  });
});

/**
 * Success route
 */
app.get('/success', function(req, res) {
  res.render('success');
});

/**
 * Start server
 */
app.listen(3000, () => {
  console.log('Getting served on port 3000');
});
