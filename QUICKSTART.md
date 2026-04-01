# 🚀 Quick Start Guide

Get your Personalized Desk Bot Assistant running in 3 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

## 3. Setup Environment

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and paste your API key:
# GEMINI_API_KEY=paste_your_key_here
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.local.example .env.local
# Then edit .env.local with your API key
```

## 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

**✅ That's it!** Face recognition models load automatically from CDN on first use.

---

## 🎯 Create Your First User

1. Click "Get Started"
2. Enter your name (e.g., "John Doe")
3. Choose a personality (e.g., "Friendly")
4. Allow webcam access
5. Click "Capture Face"
6. Confirm registration

## 🤖 Chat Away!

Start asking your desk bot questions!

---

## 📱 Next Steps

- Create multiple users with different personalities
- Test face recognition by switching users
- Explore `/users` page to manage profiles
- Check browser console (F12) for any issues
- Read the full README.md for detailed documentation

---

## 🐛 Common Issues

### "Webcam not working"
- ✅ Check browser permissions
- ✅ Try a different browser
- ✅ Make sure camera is not in use by another app

### "API key error"
- ✅ Paste key correctly, no extra spaces
- ✅ Create new key from aistudio.google.com/app/apikey
- ✅ Make sure Generative AI API is enabled

### "Face not detected"
- ✅ Improve lighting
- ✅ Face centered in frame
- ✅ Keep still for 2 seconds before capturing

### "Models loading slowly"
- ✅ First load takes longer, subsequent uses are cached
- ✅ Check your internet connection
- ✅ Refresh the page if it times out

---

## 📚 Need More Help?

1. **Check browser console:** F12 → Console tab
2. **Read full README:** [README.md](./README.md)
3. **Architecture details:** [ARCHITECTURE.md](./ARCHITECTURE.md)

Happy chatting with your desk bot! 🤖
