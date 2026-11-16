# E-पसल (E-Pasal) — Full-Stack E-Commerce Platform

A modern, production-grade e-commerce web application built with **React 19**, **Redux Toolkit**, **Node.js (Express 5)**, and **MongoDB**. Designed with an enterprise-level dual-token authentication architecture, Formik & Yup schema validations, a responsive theme engine (Light/Dark/System), real eSewa payment integration, and a mobile-first app-like experience.

🔗 **Live Demo:** [e-pasal-two.vercel.app](https://e-pasal-two.vercel.app)  
📦 **Repository:** [github.com/uniquebhattarai/E-pasal](https://github.com/uniquebhattarai/E-pasal)  

---

## ⚡ Quick Evaluation / Demo Credentials

For recruiters and visitors evaluating the live project on Vercel, pre-configured demo credentials with one-click **Auto-fill** and **Copy** buttons are integrated directly into the login modal:

| Field | Demo Value |
|---|---|
| **Email** | `cool99619@gmail.com` |
| **Password** | `Password@123` |

---

## ✨ Features & Architecture Highlights

### 🔐 Advanced Dual-Token Authentication
- **15-Minute Access Token**: Short-lived JWT signed with `JWT_SECRET`, transmitted via secure `httpOnly` cookie to eliminate client-side XSS vulnerability.
- **30-Day Refresh Token**: Long-lived rolling refresh token signed with `REFRESH_TOKEN_SECRET`, stored in an independent `httpOnly` cookie (`path: '/'`).
- **Silent Concurrency-Safe Refresh**: Frontend Axios response interceptor in `ApiConnector.js` intercepts `401 Unauthorized` responses and enqueues simultaneous requests via an async queue (`failedQueue`), seamlessly requesting a new access token via `/api/v1/auth/refresh-token` and retrying pending requests with zero user disruption.
- **OTP Email Verification**: Cryptographic 6-digit verification code generated on registration and dispatched via Nodemailer SMTP with time-based expiry.
- **XSS & CSRF Mitigation**: No sensitive auth tokens stored in accessible JavaScript memory (`localStorage` only holds non-sensitive user profile data for immediate UI rendering on refresh).

### 📋 Form Management & Validation
- **Formik & Yup**: Strict client-side schema validation for registration, login, profile editing, and checkout.
- **Granular Error Handling**: Real-time touched-state tracking, clear inline field error feedback, and disabled submission states during async calls.

### 🌗 Comprehensive Theme Engine
- **Light, Dark, and System Default**: Automatic synchronization with OS preference or manual toggle stored in `localStorage`.
- **Adaptive Branding**: Automatically switches between full-color brand logo (Light Mode) and inverted crisp white logo (Dark Mode).
- **Responsive Theme Picker**: Centered modal on desktop, animated touch-friendly slide-up bottom sheet (`ThemeBottomSheet`) on mobile viewports.

### 🛍️ Shopping & Cart Experience
- **Category Browsing & Product Discovery**: Dynamic category filtering, search, and responsive product grids.
- **Persistent Cart**: Redux Toolkit-managed cart state synchronized across sessions with quantity controls, subtotal computation, and empty state illustrations.
- **Wishlist Sync**: Independent server-side wishlist storage in MongoDB with real-time add/remove toggling and empty state navigation.

### 💳 eSewa Payment Gateway Integration
- **eSewa v2 API Integration**: Secure sandbox payment flow.
- **HMAC-SHA256 Signature Verification**: Cryptographic signature generation and verification on server endpoints to guarantee transaction integrity before fulfilling orders.

### 📦 Orders & User Dashboard
- **Order Tracking (`MyOrders`)**: Visual order timeline with live statuses (`Pending`, `Processing`, `Delivered`, `Cancelled`).
- **Modular Profile Updates**: Dedicated endpoints and modals for independently updating Header/Avatar, About bio, and Personal Details.
- **Cloudinary Integration**: Cloud storage for uploaded product media and user avatars.

### 📱 Mobile-First App Design
- Bottom navigation bar (Home, Category, Wishlist, Cart with counter badge, Account).
- Responsive mobile drawer and full-screen modals optimized to prevent content overflow or clipping.

---

## 🛠 Tech Stack

| Layer | Technology | Version / Details |
|---|---|---|
| **Frontend Framework** | React | `v19.1.1` |
| **State Management** | Redux Toolkit | `v2.8.2` (slices for auth, profile, cart, wishlist) |
| **Routing** | React Router | `v7.8.2` |
| **Forms & Validation** | Formik + Yup | Formik `v2.4.9`, Yup `v1.7.1` |
| **Styling** | Tailwind CSS | `v4.1.12` with custom color tokens & dark mode classes |
| **Icons & UI** | Lucide React + React Icons | `lucide-react v0.553.0`, `react-icons v5.5.0` |
| **HTTP Client** | Axios | `v1.11.0` (with credentials, interceptors & queue) |
| **Build Tool** | Vite | `v7.1.2` (ESM, fast HMR, gzip build optimizations) |
| **Backend Runtime** | Node.js + Express | Express `v5.1.0` |
| **Database** | MongoDB + Mongoose | Mongoose `v8.18.0` |
| **Authentication** | JWT + Bcrypt | `jsonwebtoken v9.0.2`, `bcrypt v6.0.0` |
| **Mailing Service** | Nodemailer | `v7.0.5` (OTP emails, templates) |
| **Media Storage** | Cloudinary | `v2.7.0` SDK |
| **Payment Gateway** | eSewa | eSewa API v2 with HMAC-SHA256 signature verification |
| **Hosting** | Vercel + Render | Frontend on Vercel, Backend API on Render |

---

## 🏗 Architecture & Project Structure

```
E-Pasal/
├── frontend/                     # React 19 + Vite client
│   ├── src/
│   │   ├── component/
│   │   │   ├── auth/             # LoginForm (with demo auto-fill), SignupForm, VerifyEmailForm
│   │   │   ├── common/           # Input, Password, Button, Modal, ThemeBottomSheet, ThemeToggle
│   │   │   ├── core/             # Dashboard, Navbar, Footer, Order components
│   │   │   └── AuthModal.jsx     # Responsive auth container modal
│   │   ├── context/              # ThemeContext (light, dark, system modes)
│   │   ├── pages/                # Home, CategoryDetails, Cart, Wishlist, MyOrders, MyProfile
│   │   ├── services/             # ApiConnector (Axios instance + 401 refresh queue), Api endpoints
│   │   ├── slices/               # Redux slices: AuthSlice, ProfileSlice, CartSlice, WishlistSlice
│   │   └── validations/          # Yup schemas: authValidation.js, profileValidation.js
│   └── package.json
│
└── server/                       # Node.js + Express 5 API
    ├── config/                   # Database (MongoDB connection), Cloudinary config
    ├── controller/               # auth.js (login, signup, OTP, refreshToken), order, profile, payment
    ├── mail/templates/           # HTML responsive email templates (OTP, reset password)
    ├── middleware/               # auth.js (token verification, role guards)
    ├── models/                   # Mongoose schemas: user, profile, product, category, order, otp
    ├── routes/                   # API routes: user, profile, product, order, payment
    ├── utils/                    # mailSender.js, imageUploader.js
    ├── index.js                  # Server entry, CORS, cookieParser, etag:false
    └── package.json
```

---

## 🔄 Authentication & Session Token Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant API as Express API
    participant DB as MongoDB

    User->>API: POST /api/v1/auth/login { email, password }
    API->>DB: Verify credentials (bcrypt)
    DB-->>API: User Record
    Note over API: Generate Access Token (15m)<br/>Generate Refresh Token (30d)
    API-->>User: 200 OK + Set-Cookie: token (15m, httpOnly)<br/>Set-Cookie: refreshToken (30d, httpOnly)

    Note over User,API: Normal Authenticated API Requests
    User->>API: GET /api/v1/profile (with token cookie)
    API-->>User: 200 OK (Data returned)

    Note over User,API: Access Token Expires after 15 minutes
    User->>API: GET /api/v1/orders
    API-->>User: 401 Unauthorized (Access token expired)

    Note over User: Axios Interceptor catches 401<br/>Enqueues subsequent requests in failedQueue
    User->>API: POST /api/v1/auth/refresh-token (with refreshToken cookie)
    API->>API: Verify refreshToken against REFRESH_TOKEN_SECRET
    Note over API: Issue new 15m Access Token<br/>Roll new 30d Refresh Token
    API-->>User: 200 OK + updated httpOnly cookies

    Note over User: Replay queued requests automatically
    User->>API: GET /api/v1/orders (retried with new token)
    API-->>User: 200 OK (Orders returned smoothly)
```

---

## 📸 Screenshots

### 🌟 Desktop Experience

#### Homepage (Light Mode)
![Homepage Light Mode](./screenshots/HomePage.png)

#### Homepage (Dark Mode)
![Homepage Dark Mode](./screenshots/HomepageDarkMode.png)

#### Product Categories
![Category List](./screenshots/Category.png)

#### Single Category Products View
![Single Category View](./screenshots/CategoryList.png)

---

### 📱 Mobile Experience

| Mobile Home & Catalog | Mobile Navigation & Account | Theme Selector Bottom Sheet |
|:---:|:---:|:---:|
| ![Mobile View 1](./screenshots/MobileMode1.png) | ![Mobile View 2](./screenshots/MobileMode2.png) | ![Mobile View 3](./screenshots/MobileMode3.png) |

---

### 🔐 Authentication & Security

#### Login Modal (with Demo Credentials & One-Click Auto-fill)
![Login Modal](./screenshots/Login.png)

#### Signup Form (Formik + Yup Validation)
![Signup Modal](./screenshots/Signup.png)

#### 6-Digit OTP Verification Modal
![OTP Verification](./screenshots/SignupVerify.png)

#### Verification Email Notification
![Verification Email](./screenshots/VerificationEmail.png)

---

### 🛍️ Shopping, Wishlist & Orders

#### Shopping Cart
![Shopping Cart](./screenshots/Cart.png)

#### Wishlist
![Wishlist](./screenshots/Wishlist.png)

#### My Orders & Tracking
![My Orders](./screenshots/MyOrders.png)

---

### 💳 eSewa Payment Gateway Flow

#### Step 1: eSewa Gateway Login
![eSewa Step 1](./screenshots/Esewa1.png)

#### Step 2: Payment Confirmation & Merchant Details
![eSewa Step 2](./screenshots/Esewa2.png)

#### Step 3: Transaction OTP Verification
![eSewa Step 3](./screenshots/Esewa3.png)

#### Step 4: Payment Confirmation
![eSewa Step 4](./screenshots/Esewa4.png)

#### Payment Successful Confirmation
![Payment Successful](./screenshots/PaymentSuccessfull.png)

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI
- **Cloudinary Account**: For image upload credentials
- **Gmail App Password**: For Nodemailer OTP dispatch

---

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/uniquebhattarai/E-pasal.git
cd E-pasal

# Install root dependencies
npm install

# Install client dependencies
cd frontend && npm install

# Install backend dependencies
cd ../server && npm install
```

---

### 2. Configure Environment Variables

#### Backend (`server/.env`):
```env
PORT=3069
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/epasal?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_access_key
REFRESH_TOKEN_SECRET=your_super_secret_jwt_refresh_key
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CLOUD_NAME=your_cloudinary_cloud_name
FOLDER_NAME=epasal
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`):
```env
VITE_BASE_URL=http://localhost:3069/api/v1
VITE_FRONTEND_URL=http://localhost:5173
```

---

### 3. Run the Application

#### Concurrent Execution (Root):
```bash
npm run dev
```

#### Run Individually:
```bash
# Terminal 1: Backend Server (runs on http://localhost:3069)
cd server
npm start

# Terminal 2: Vite Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

---

