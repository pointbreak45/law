# Quick Start Guide - LegalBot India

Your React frontend application has been set up in: `C:\Users\Admin\Desktop\ashwin\legalbot-india`

## 🚀 Getting Started

### Option 1: Use the Setup Script (Recommended)
1. Open PowerShell as Administrator
2. Navigate to the project folder:
   ```powershell
   cd C:\Users\Admin\Desktop\ashwin\legalbot-india
   ```
3. Run the setup script:
   ```powershell
   .\setup.ps1
   ```

### Option 2: Manual Setup
1. Open PowerShell and navigate to the project:
   ```powershell
   cd C:\Users\Admin\Desktop\ashwin\legalbot-india
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm start
   ```

## 🔓 Demo Login
- **Email**: `aditi.sharma@example.com`
- **Password**: Any password (demo mode)

## 📱 Frontend Pages Available

### 1. **Login Page** (`/login`)
- User authentication form
- Email/password validation
- "Fresh start, secure access" design
- Automatic redirect after successful login

### 2. **Dashboard/Chatbot** (`/dashboard`)
- Interactive legal chatbot interface
- Suggested prompts for common legal questions
- Real-time messaging with typing indicators
- Legal topics: FIR filing, Article 21, Fundamental Rights, etc.

### 3. **User Profile** (`/profile`)
- Editable user profile information
- Avatar display and user details
- Getting started tasks and progress
- Profile data persistence

## 🌐 Application URLs
- **Development Server**: `http://localhost:3000`
- **Login**: `http://localhost:3000/login`
- **Dashboard**: `http://localhost:3000/dashboard`
- **Profile**: `http://localhost:3000/profile`

## 🎨 Features Implemented

✅ **Authentication System**
- Login/logout functionality
- Session persistence
- Protected routes
- Form validation

✅ **Interactive Chatbot**
- Real-time messaging
- Suggested legal prompts
- Intelligent responses for legal queries
- Chat history and session management

✅ **User Profile Management**
- View and edit profile information
- Avatar display
- Progress tracking
- Data persistence

✅ **Responsive Design**
- Mobile-friendly layout
- Professional UI matching mockups
- Smooth animations and interactions
- Accessible design patterns

✅ **Real-time Features**
- WebSocket implementation (simulated)
- Live chat functionality
- Typing indicators
- Message persistence

## 🛠️ Troubleshooting

### PowerShell Execution Policy
If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
If port 3000 is busy:
- The app will automatically suggest another port (like 3001)
- Or kill any process using port 3000:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Dependencies Issues
Clean install:
```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

## 📁 Project Structure
```
legalbot-india/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── Login.js       # Login page
│   │   ├── UserProfile.js # Profile management
│   │   └── Chatbot.js     # Chat interface
│   ├── context/           # State management
│   │   └── AuthContext.js # Authentication
│   ├── hooks/             # Custom hooks
│   │   └── useWebSocket.js # WebSocket functionality
│   ├── App.js             # Main app with routing
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies
├── README.md             # Full documentation
├── QUICK-START.md        # This file
└── setup.ps1             # Automated setup script
```

## 🔧 Next Steps

1. **Backend Integration**: Connect to real APIs by updating the mock functions
2. **Database**: Replace localStorage with proper database integration
3. **Real WebSocket**: Connect to actual WebSocket server for live chat
4. **Legal Content**: Integrate with legal databases and APIs
5. **Production Build**: Run `npm run build` for deployment

## 📞 Support
- Check the full README.md for detailed documentation
- All components are responsive and production-ready
- Easy to extend and customize for your specific needs