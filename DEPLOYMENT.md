# 🚀 Deployment Guide - Loan Management System

## 📋 **Prerequisites**

### 1. **MongoDB Atlas Setup**
- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a new cluster (free tier available)
- Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/lms`

### 2. **Vercel Account**
- Create account at [Vercel](https://vercel.com)
- Connect your GitHub repository

---

## 🎯 **Frontend Deployment (Next.js)**

### **Step 1: Deploy Frontend**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. **Framework Preset**: Next.js
5. **Root Directory**: `frontend`
6. Click "Deploy"

### **Step 2: Environment Variables (Frontend)**
In Vercel project settings → Environment Variables, add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

---

## 🎯 **Backend Deployment (Node.js API)**

### **Step 1: Deploy Backend**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project" 
3. Import your GitHub repository again
4. **Framework Preset**: Other
5. **Root Directory**: `backend`
6. Click "Deploy"

### **Step 2: Environment Variables (Backend)**
In Vercel project settings → Environment Variables, add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-production-jwt-secret-at-least-32-characters-long
CLIENT_ORIGIN=https://your-frontend-url.vercel.app
UPLOAD_DIR=uploads
NODE_ENV=production
```

---

## 🔄 **Update Frontend API URL**

After backend deployment, update frontend environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

---

## 🌱 **Database Seeding**

### **Option 1: Manual Seeding**
1. Go to your backend Vercel deployment
2. Add `/seed` to the URL
3. Visit: `https://your-backend-url.vercel.app/seed`

### **Option 2: MongoDB Compass**
1. Connect to your MongoDB Atlas cluster
2. Import the demo users manually

---

## 📊 **Demo URLs Structure**

After deployment, you'll have:

```
Frontend:  https://your-project-frontend.vercel.app
Backend:   https://your-project-backend.vercel.app
API:       https://your-project-backend.vercel.app/api
Health:    https://your-project-backend.vercel.app/health
```

---

## 🧪 **Testing Deployment**

### **Frontend Tests:**
- ✅ Landing page loads
- ✅ Login/Register forms work
- ✅ API calls connect to backend

### **Backend Tests:**
- ✅ Health endpoint: `/health`
- ✅ Auth endpoints: `/api/auth/login`
- ✅ Database connection working
- ✅ CORS properly configured

---

## 👥 **Demo Accounts**

All accounts use password: `Password@123`

| Role | Email | Access |
|------|-------|---------|
| Admin | admin@lms.dev | All modules |
| Sales | sales@lms.dev | Lead management |
| Sanction | sanction@lms.dev | Loan approval |
| Disbursement | disbursement@lms.dev | Loan disbursement |
| Collection | collection@lms.dev | Payment collection |
| Borrower | borrower@lms.dev | Loan application |

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **CORS Errors**
- Ensure `CLIENT_ORIGIN` matches your frontend URL exactly
- No trailing slash in URLs

#### **Database Connection**
- Verify MongoDB Atlas connection string
- Check IP whitelist (allow all: 0.0.0.0/0)
- Ensure database user has read/write permissions

#### **Environment Variables**
- All variables must be set in Vercel dashboard
- Redeploy after changing environment variables

#### **Build Errors**
- Check Vercel function logs
- Ensure all TypeScript errors are resolved
- Verify all dependencies are in package.json

---

## 🎯 **Production Checklist**

### **Security:**
- ✅ Strong JWT secret (32+ characters)
- ✅ MongoDB connection secured
- ✅ CORS properly configured
- ✅ Environment variables set

### **Performance:**
- ✅ Frontend optimized build
- ✅ Backend TypeScript compiled
- ✅ Database indexed properly
- ✅ API response caching

### **Functionality:**
- ✅ All pages load correctly
- ✅ Authentication working
- ✅ File uploads functional
- ✅ Database operations working
- ✅ Role-based access control active

**Ready for production! 🚀**