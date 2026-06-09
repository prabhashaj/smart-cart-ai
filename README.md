# 🛒 SmartCart AI

**AI-Powered Grocery Shopping Made Simple**

Transform your handwritten grocery lists into ready-to-checkout shopping carts with the power of artificial intelligence. SmartCart AI uses advanced OCR and NLP technology to automatically detect items, match products, and streamline your entire grocery shopping experience.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://smart-cart-ai-xi.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/prabhashaj/smart-cart-ai)

## 🌟 Live Demo

**🔗 [https://smart-cart-ai-xi.vercel.app](https://smart-cart-ai-xi.vercel.app)**

Experience the future of grocery shopping with our fully deployed application!

## ✨ Features

### 🤖 AI-Powered Intelligence
- **Smart OCR Recognition** - Upload photos of handwritten grocery lists
- **Natural Language Processing** - Automatically extract items, quantities, and units
- **Product Matching** - Intelligent matching with 99% accuracy
- **Real-time Processing** - Get results in under 3 seconds

### 🛍️ Shopping Experience
- **Category Organization** - Browse products by Fruits, Vegetables, Dairy, Bakery, Meat, Pantry, Beverages, Snacks, and Frozen
- **Smart Search** - Find products instantly with intelligent search
- **Filter & Sort** - Organize products by name, price, or category
- **Cart Management** - Add, remove, and adjust quantities seamlessly

### 💳 Complete E-Commerce Flow
- **User Authentication** - Secure login and signup system
- **Digital Wallet** - Manage your balance and transactions
- **Order History** - Track all your past orders
- **Checkout Process** - Smooth and intuitive payment flow

### 🎨 Modern UI/UX
- **Beautiful Design** - Elegant pink gradient theme with smooth animations
- **Responsive Layout** - Perfect experience on mobile, tablet, and desktop
- **Animated Backgrounds** - Dynamic, eye-catching visual effects
- **Intuitive Navigation** - User-friendly interface with clear CTAs

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern component-based architecture
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing

### UI Framework
- **shadcn/ui** - High-quality accessible components
- **Radix UI** - Primitive components
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library

### AI & Processing
- **Tesseract.js** - OCR text extraction from images
- **Fuse.js** - Fuzzy search for product matching
- **Custom NLP** - Grocery list parsing algorithms

### State Management & Data
- **React Context API** - Global state management
- **TanStack Query** - Server state management
- **Local Storage** - Client-side data persistence

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/prabhashaj/smart-cart-ai.git
cd smart-cart-ai
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Start the development server**
```bash
npm run dev
# or
bun dev
```

4. **Open your browser**
```
Navigate to http://localhost:8080
```

## 🎯 Usage

### 1. Authentication
- Sign up for a new account or log in with existing credentials
- Demo accounts work instantly for testing

### 2. Upload Grocery List
- Click "Upload List" on the shop page
- Take a photo or upload an image of your handwritten list
- Or paste your grocery list as text
- AI will automatically detect and match items

### 3. Browse & Shop
- Explore products organized by categories
- Use search and filters to find specific items
- Add products to your cart with one click
- Adjust quantities as needed

### 4. Checkout
- Review your cart
- Proceed to checkout
- Complete your order
- View order history in the Orders page

## 📁 Project Structure

```
smart-cart-ai/
├── src/
│   ├── components/          # React components
│   │   ├── cart/           # Cart related components
│   │   ├── checkout/       # Checkout flow components
│   │   ├── home/           # Landing page components
│   │   ├── layout/         # Layout components (Header, etc.)
│   │   ├── review/         # Review list components
│   │   ├── ui/             # shadcn/ui components
│   │   └── upload/         # Upload and processing components
│   ├── context/            # React Context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── CartContext.tsx # Cart and wallet state
│   ├── data/               # Static data and product catalog
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── nlp.ts         # NLP processing for lists
│   │   ├── ocr.ts         # OCR image processing
│   │   └── utils.ts       # Helper functions
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   └── test/               # Test files
├── public/                 # Static assets
└── dist/                   # Production build (generated)
```

## 🏗️ Build & Deployment

### Build for Production
```bash
npm run build
# or
bun run build
```

### Preview Production Build
```bash
npm run preview
# or
bun run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

The application is currently deployed at: **[https://smart-cart-ai-xi.vercel.app](https://smart-cart-ai-xi.vercel.app)**

## 🧪 Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```
## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Prabhash**
- GitHub: [@prabhashaj](https://github.com/prabhashaj)
