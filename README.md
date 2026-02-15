# Demo Book Store Payment Integration

A simple, user-friendly e-commerce application for purchasing books, integrated with **Stripe Payment Element** to enable secure credit card payments. This application includes book selection, checkout with Stripe Elements, and payment confirmation with transaction details.

## 1. How to Build, Configure and Run Your Application

Follow these step-by-step instructions to set up and run the application locally. No advanced technical knowledge is required—just basic familiarity with the terminal and text editing.

### Prerequisites

- Node.js (v14 or higher; tested on v24.13.1)

- npm (v6 or higher; tested on v11.8.0)

- A free Stripe Test Account (sign up at [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register))

### Step 1: Clone the Repository

First, clone the project repository to your local machine and navigate into the project folder:

```bash
git clone https://github.com/Yifan-Van/Demo-Book-Store-Payment-Integration
cd Demo-Book-Store-Payment-Integration
```

### Step 2: Install Dependencies

Install all required packages (including Stripe SDK) using npm:

```bash
npm install
npm install stripe@latest --save
```

### Step 3: Configure Environment Variables

To keep your Stripe API keys secure, create a `.env` file in the project root directory and add your Stripe test keys. You can find these keys in your [Stripe Dashboard > Developers > API Keys](https://dashboard.stripe.com/test/apikeys).

```env
# .env file (save this in the project root)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

*Note: Replace "your_secret_key_here" and "your_publishable_key_here" with your actual Stripe test keys (format: sk_test_xxxx and pk_test_xxxx).*

### Step 4: Run the Application

Start the local server with the following command:

```bash
npm start
```

You will see a message in the terminal: `Getting served on port 3000` .

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to use the application.

### Step 5: Test the Payment Flow

Use Stripe’s test credit card information to simulate a payment (no real charges will be made):

- Card Number: `4242 4242 4242 4242`

- Expiry Date: Any future date (e.g., 12/34)

- CVV: Any 3-digit number (e.g., 123)

- Email: Any valid email address (e.g., test@example.com)

- Full Name: Any name (e.g., John Doe)

- Address: Any address (e.g., 123 Main St)

- City: Any city (e.g., New York)

- ZIP Code: Any valid US ZIP (e.g., 10001)

After submitting the payment, you will be redirected to a success page with your transaction details.

## 2. How Does the Solution Work? 

This application follows a simple, intuitive flow to handle book selection and secure payment processing. Below is a breakdown of its functionality, the Stripe APIs used, and its architecture.

### Core Workflow

1. **Book Selection**: Users visit the homepage (`/`), select a book, and are redirected to the checkout page with the book’s ID (passed via URL query parameter).

2. **Checkout Page**: The checkout page (`/checkout`) loads the book’s title and price, collects the user’s email, shipping address and renders Stripe’s Payment Element (split into card number, expiry date, and CVC fields for better user experience).

3. **Payment Intent Creation**: When the user clicks "Pay", the frontend sends a POST request to the `/create-payment-intent` API endpoint. The backend uses Stripe’s API to create a Payment Intent.

4. **Payment Confirmation**: The backend returns a`clientSecret` (from the Payment Intent) to the frontend. The frontend uses this `clientSecret` to call Stripe’s `confirmCardPayment` method, which validates the card details and processes the payment.

5. **Success Confirmation**: If the payment succeeds, the user will be redirected to the success page (`/success`), which displays the total amount paid, the Stripe Payment Intent ID (begins with `pi_`) and where the booked will be delivered to.

### Stripe APIs & Components Used

This application uses **Stripe Payment Element**, along with the following Stripe APIs:

- **Stripe Payment Element**: A pre-built, secure UI component for collecting credit card details. Split into three fields (card number, expiry, CVC) for better usability, especially on mobile devices. It handles card formatting, validation, and PCI compliance.

- **Payment Intents API**: Used to create a Payment Intent (`stripe.paymentIntents.create`), which tracks the payment from creation to success/failure. This API returns the `clientSecret` needed to confirm the payment on the frontend.

- **stripe.confirmCardPayment**: A frontend method that confirms the payment using the `clientSecret` and card details collected by the Payment Element. It returns the payment status (success/failure) and transaction details.

### Application Architecture

The application uses a simple, modular architecture built with Node.js and Express, with a separation of frontend and backend concerns:

#### Backend (Node.js + Express)

- Handles HTTP requests (GET/POST) and routes (home, checkout, success, payment intent).

- Integrates with Stripe’s API using the Stripe SDK (secret key from `.env`).

- Serves static files (CSS/JS) and renders Handlebars templates.

- Validates user input to prevent errors.

#### Frontend (Handlebars + Vanilla JavaScript)

- `index.hbs`: Homepage with book selection (hardcoded for simplicity, no database required).

- `checkout.hbs`: Checkout page with Stripe Payment Element, email, shipping address input, and payment submission logic.

- `success.hbs`: Success page that displays transaction details (amount, Payment Intent ID, shipping address) pulled from URL parameters.

#### Template Engine (Handlebars)

Handlebars is used to pass dynamic data from the backend to the frontend (e.g., book title/price, Stripe publishable key).

## 3. How Did You Approach This Problem? 

I approached this project with a "user-first, problem-solve step-by-step" mindset, focusing on meeting all requirements while keeping the code simple, maintainable, and easy to extend. Below is a breakdown of my approach, the documentation used, and the challenges encountered.

### Problem-Solving Approach

1. **Requirement Analysis**: First, I checked my starting point based on the repo provided and I found what I need to do is: (1) Allow users to select a book(this actually is already completed based on the repo); (2) Implement checkout with Stripe Payment Element; (3) Display payment confirmation with amount and Payment Intent ID. (4) Optmization after local running for the entire functionality. I prioritized these goals to ensure the application works end-to-end before adding enhancements.

2. **Environment Setup**: I set up the Node.js/Express project, installed dependencies (including Stripe SDK and Handlebars), and configured basic routes to ensure the frontend templates load correctly.

3. **Stripe Integration (Frontend)**: I embedded Stripe’s Payment Element into the checkout page, choosing the split-field design (card number, expiry, CVC) for better user experience. I ensured the element renders correctly and is compatible with the application’s styling.

4. **Stripe Integration (Backend)**: I implemented the `/create-payment-intent` API endpoint to create a Payment Intent, handle input validation, and return the `clientSecret` to the frontend. I used environment variables to secure Stripe keys.

5. **Testing & Debugging**: I tested the full flow repeatedly, fixing errors (e.g., 500 API errors, incorrect payment amounts) and ensuring the success page displays the correct transaction details.

6. **Usability Enhancements**: I added try-catch logic to better handle errors. From a user experience perspective, I added shipping address collection and a "Back to Book Store" button on the success page, and display detailed transaction related values.

### Documentation Used

I relied on official documentation to ensure correct implementation of Stripe and Express features:

- Stripe Payment Element Docs: [https://stripe.com/docs/payments/payment-element](https://stripe.com/docs/payments/payment-element)

- Stripe Payment Intents API Docs: [https://docs.stripe.com/api/payment_intents/create](https://docs.stripe.com/api/payment_intents/create)

- Stripe JS reference for confirmCardPayment method: [https://docs.stripe.com/js/payment_intents/confirm_card_payment](https://docs.stripe.com/js/payment_intents/confirm_card_payment)

- Stripe test cards in sandbox: [https://docs.stripe.com/testing#cards](https://docs.stripe.com/testing#cards)

- Express.js Docs: [https://expressjs.com/](https://expressjs.com/)

- Handlebars Docs: [https://handlebarsjs.com/](https://handlebarsjs.com/)

### Challenges Encountered & Solutions

During development, I faced several common challenges—all of which were resolved with targeted debugging and reference to official documentation:

|Challenge|Solution|
|---|---|
|Stripe Payment Element not rendering or unclickable|Wrapped the Stripe initialization code in`DOMContentLoaded` to ensure the frontend DOM loads before mounting the element. Also fixed variable name conflicts that caused JavaScript syntax errors.|
|Incorrect payment amount (100x higher than expected)|Fixed double amount conversion: The book price was already stored in cents (e.g., $23 = 2300 cents), so I removed the extra `Number(amount) * 100` in the Payment Intent creation.|
|500 Error: "Received unknown parameter: customer_email"|Replaced `customer_email` with`receipt_email` (Checked field names from Stripe API doc).|
|Missing shipping address collection during checkout|Added shipping address collection and pass the value to URL so it can be displayed in the success page.|

## 4. Extending the Application for a More Robust Instance

This application provides a solid foundation for a book store with Stripe payments. To make it more robust, scalable, and production-ready, here are key enhancements I would add:

### 1. Payment & Order Management

- **Add a Database**: Integrate a database to store book details, inventory, user information, and order history (currently the book data are hardcoded).

- **Stripe Webhooks**: Implement Stripe Webhooks (e.g., `payment_intent.succeeded`, `payment_intent.payment_failed`) to track payment status in real time, send email receipts to users, and update order records. This also can be a fallback in case some Internet issues which blocks our frontend to get the payment results notification.

- **Refund Functionality**: Add a refund feature using Stripe’s Refunds API, allowing admins to process refunds and update order statuses.

### 2. User Experience (UX) Improvements

- **Shopping Cart**: Add a shopping cart feature to allow users to select multiple books and checkout once (instead of one book at a time).

- **User Management**: Implement user registration/login flow to better support return business.

- **Input Validation & Loading States**: Add more robust input validation (e.g., email format, card details) and loading spinners during payment processing to improve user clarity.

- **Payment Methods Extension**: Extend the Stripe Payment Element to support Apple Pay, Google Pay, and other payment methods.

### 3. Scalability & Security

- **Rate Limiting**: Add rate limiting (e.g., using express-rate-limit) to prevent API abuse and protect against brute-force attacks.

- **HTTPS & Deployment**: Deploy the application to a cloud provider (e.g., GCP, AWS) with HTTPS (required for Stripe production payments) and set up auto-scaling for high traffic.

- **Logging & Monitoring**: Add logging to track errors and user actions, and integrate monitoring tools to alert on critical issues or sudden drop of payment success rate.