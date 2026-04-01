# 🤖 Personalized Desk Bot Assistant

A full-stack software prototype of an AI-powered desk robot assistant that recognizes users through face recognition and provides personalized, intelligent conversations powered by Google Gemini API.

## 🎯 Project Overview

This is a **software prototype** simulating a personalized desktop robot assistant. It replaces hardware components with a modern web interface:

| Component | Hardware (Future) | Prototype (Current) |
|-----------|------|---------|
| Camera/Vision | Robot Camera Module | Browser Webcam |
| Display | Robot Screen/LEDs | Web Dashboard |
| Processing | Embedded System | Next.js Backend |
| Intelligence | Hardcoded Rules | Gemini API |
| Physical Actions | Motors/Actuators | UI Animations |

The app demonstrates how modern LLMs can power personalized desk assistants through:
- ✅ Face recognition for user identification
- ✅ Personality-aware responses
- ✅ Contextual awareness via chat history
- ✅ Non-intrusive desk companion behavior

## 🌟 Key Features

### 1. **Smart Face Recognition**
- Browser-based face detection using face-api.js
- Per-user face descriptor storage (no biometric uploads)
- Real-time recognition with confidence scoring
- Works entirely in the browser

### 2. **User Profiles**
- Register with name, nickname, and personality preference
- Choose from 4 personality modes:
  - 😊 **Friendly** - Warm, casual, uses emojis
  - 🎩 **Formal** - Professional, structured
  - ⚡ **Energetic** - Lively, enthusiastic
  - 🧘 **Calm** - Soft, peaceful, balanced
- Automatic face capture during registration

### 3. **Personalized AI Assistant**
- Powered by Google Gemini API
- Responses tailored to user personality and preferences
- Conversation history maintained per session
- Acts as a desk companion, NOT a system control agent
- Provides information, assistance, and friendly conversation

### 4. **Modern User Interface**
- Dark mode with glassmorphism design
- Animated robot avatar showing listening/idle states
- Real-time chat interface with typing indicators
- Responsive design for desktop and mobile
- Smooth transitions using Framer Motion

### 5. **Privacy-First Architecture**
- All user authentication happens locally
- Face descriptors stored in browser localStorage only
- Chat history never leaves the device (unless integrated with backend)
- Only Gemini API calls sent to external servers
- No user data monetization or tracking

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animation:** Framer Motion
- **Face Recognition:** face-api.js
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (via Next.js)
- **API:** Next.js API routes
- **LLM:** Google Gemini API
- **Storage:** Browser localStorage (prototype), IndexedDB (alternative)

### Deployment Ready
- Vercel (recommended)
- Netlify, AWS Lambda, etc.

## 📋 Project Structure

```
desk-bot-assistant/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Global styles
│   ├── api/
│   │   └── chat/
│   │       └── route.ts           # Gemini chat API endpoint
│   ├── register/
│   │   └── page.tsx               # User registration with face capture
│   ├── recognize/
│   │   └── page.tsx               # Face recognition login
│   ├── assistant/
│   │   └── page.tsx               # Main chat interface
│   └── users/
│       └── page.tsx               # View all registered users
├── components/
│   ├── ui/                        # reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── spinner.tsx
│   ├── nav-header.tsx             # Navigation bar
│   ├── webcam-capture.tsx         # Webcam interface
│   ├── chat-message.tsx           # Chat message bubble
│   └── robot-avatar.tsx           # Animated avatar
├── lib/
│   ├── types.ts                   # TypeScript types
│   ├── storage.ts                 # localStorage management
│   ├── face-recognition.ts        # Face detection & recognition
│   └── utils.ts                   # Helper functions
├── public/
│   └── models/                    # face-api.js models (add manually)
│       ├── tiny_face_detector_model-weights_manifest.json
│       ├── tiny_face_detector_model-weights.bin
│       └── [other model files...]
├── env.local.example              # Environment template
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript config
├── next.config.ts                 # Next.js config
└── package.json                   # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Google Gemini API key (free tier available)
- Modern browser with webcam access

### Installation

1. **Clone and setup:**
```bash
cd terafac-hackathon
npm install
```

2. **Get Gemini API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a free API key
   - Copy to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. **Download face-api.js models:**

The models must be downloaded manually from face-api.js:

```bash
# Create public/models directory
mkdir -p public/models

# Download models from:
# https://github.com/vladmandic/face-api/tree/master/model
# Download all .json and .bin files from that repo's model folder
# Place them in public/models/
```

Or use this script to download them:
```bash
npm run download-models
```

(To implement this, add to `package.json` scripts a Node script that downloads from the face-api GitHub)

4. **Run development server:**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🎮 How to Use

### 1. Register a New User

1. Go to `/register`
2. Enter your name and optional nickname
3. Choose your personality preference
4. Grant webcam permissions
5. Click "Capture Face" to register
6. Confirm and you'll be taken to the chat interface

### 2. Log In with Face Recognition

1. Go to `/recognize`
2. Click "Start Face Recognition"
3. Position your face in the camera
4. Click "Capture Face"
5. System recognizes you and opens chat
6. You're ready to interact with your desk bot!

### 3. Chat with Your Desk Bot

1. Type your question or message
2. Press Enter or click Send
3. The bot responds with personality-aware answers
4. Continue the conversation naturally
5. Use "Clear Chat" to start fresh
6. Use "Logout" to switch users

### 4. View All Users

- Go to `/users` to see registered profiles
- Chat with any user directly
- Delete user profiles if needed

## 🧠 How It Works

### Face Recognition Pipeline

```
Webcam Input
    ↓
face-api.js Detection
    ↓
Extract Face Descriptor (128-dim vector)
    ↓
Compare with Stored Descriptors
    ↓
Euclidean Distance < Threshold?
    ↓
SUCCESS: User Identified / FAIL: Unknown User
```

### Chat Pipeline

```
User Input + Profile + Personality
    ↓
Send to /api/chat (Next.js)
    ↓
Build System Prompt (personality injection)
    ↓
Add Conversation History
    ↓
Call Gemini API
    ↓
Stream/Return Response
    ↓
Display in Chat UI
    ↓
Save to Local Storage
```

### Data Flow

```
Browser (User Interaction)
    ↓
Next.js API Routes
    ↓
Gemini API (only for LLM calls)
    ↓
Response back to Browser
    ↓
localStorage (Persistence)
```

## 🔐 Privacy & Security

### What Stays on Device
✅ User profiles (name, nickname, personality)  
✅ Face descriptors (128-dimensional vectors, not images)  
✅ Chat history  
✅ Face recognition processing  

### What Goes to External Services
🌐 Only Gemini API calls for LLM responses  
🌐 Your input text and personality preference  
🌐 NO face images or raw biometric data  

### Security Notes
- No authentication/password system (prototype)
- Face descriptor is one-way hash (not reversible to image)
- localStorage is unencrypted (add encryption for production)
- No cross-site data sharing
- CORS configured for API-only external calls

## 🎨 Personality System

Each user personality modifies the AI response style:

### Friendly
```
"Be warm, conversational, and use a casual friendly tone. 
Use friendly language and occasional emojis."
```
Response: "Hey there! Great question! 😊 Let me help..."

### Formal
```
"Be professional and use a formal tone. 
Maintain a business-like demeanor."
```
Response: "Certainly. I shall provide a comprehensive answer..."

### Energetic
```
"Be enthusiastic and lively. Use exclamation marks and excitement!"
```
Response: "Oh this is AWESOME! 🚀 Let me tell you about..."

### Calm
```
"Be soft, balanced, and peaceful. Use gentle language."
```
Response: "Take a breath... let's explore this gently..."

## 📱 UI/UX Features

### Responsive Design
- Desktop: Full layout with webcam + avatar + chat
- Tablet: Optimized two-column layout
- Mobile: Stacked layout with hidden webcam

### Animations
- Smooth page transitions
- Animated robot avatar (breathing, listening states)
- Chat message fade-in effects
- Typing indicators
- Loading spinners

### Accessibility
- Semantic HTML
- Keyboard navigation support
- Form validation with error messages
- Clear focus indicators
- Alternative text for icons

## 🔮 Future Enhancements

This prototype is designed to be extensible. Here's how to build upon it:

### 1. Memory System Implementation

**Current State:** Chat history only in current session  
**Future State:** Long-term, user-isolated memory

```typescript
// Architecture for multi-user memory:

interface UserMemory {
  profileMemory: {
    preferences: string[];
    workStyle: string;
    interests: string[];
  };
  conversationHistory: ChatMessage[];
  semanticMemory: {
    topics: { topic: string; vectorEmbedding: Float32Array; importance: number }[];
    relationships: string[];
    learnings: string[];
  };
  recentContext: ChatMessage[]; // Last 5-10 messages for quick recall
}

// Pre-chat memory retrieval:
async function retrieveUserMemory(userId: string) {
  const user = await db.users.findById(userId);
  const relevantMemories = await vectorDb.search(
    userInput,
    userId // IMPORTANT: User-isolated search
  );
  return {
    profile: user,
    recentChat: await db.chatHistory.getRecent(userId, 5),
    semanticContext: relevantMemories,
  };
}

// Inject into LLM:
const prompt = `
User Profile: ${userMemory.profile}
Recent Context: ${userMemory.recentChat}
Relevant Memories: ${userMemory.semanticContext}
Message: ${userInput}
`;
```

**Stack:**
- PostgreSQL: User profiles, chat history
- Chroma / FAISS: Vector embeddings for semantic memory
- Redis: Cache recently used memories
- LangChain: Memory chain management

### 2. Backend Architecture Evolution

```
Current:
Frontend → Next.js API Routes → Gemini API

Future:
Frontend → Next.js API Routes → Backend Server
                                    ↓
                        [Auth Service]
                        [Memory Engine]
                        [LLM Router]
                        [Vector DB]
                        
Backend → PostgreSQL
Backend → Chroma/FAISS
Backend → Cache (Redis)
```

### 3. Multi-User Isolation

**Critical for Security:**

```typescript
// Ensure one user's memory never leaks to another:

async function chat(userId: string, message: string) {
  // 1. Verify user identity
  const user = await verifyUser(userId);
  
  // 2. Fetch ONLY this user's memories
  const memories = await memoryDb.query(
    `WHERE userId = ${userId}` // CRITICAL
  );
  
  // 3. Fetch ONLY this user's chat history
  const history = await chatDb.query(
    `WHERE userId = ${userId}`
  );
  
  // 4. Call LLM with isolated context
  const response = await llm.generate({
    context: memories,
    history: history,
    message: message,
  });
  
  // 5. Save to user's namespace ONLY
  await memoryDb.save({
    userId: userId, // Isolate storage
    content: response,
  });
}
```

### 4. Real Hardware Integration

```python
# Raspberry Pi / Robot Integration

from desk_bot_client import DeskBotClient
import camera
import speaker
import motor

client = DeskBotClient(
    backend_url="https://your-backend.com",
    robot_id="desk-bot-001"
)

# Face recognition on robot
face = camera.capture()
user = client.recognize_face(face)

# Speak response
response = client.chat(user_id=user.id, message="Hello")
speaker.speak(response.text)

# Optional: Animate robot
motor.turn_head(response.emotion)
```

### 5. Production Deployment

```bash
# Frontend: Vercel
vercel deploy

# Backend: Docker + Cloud Run / ECS
docker build -t desk-bot-backend .
gcloud run deploy desk-bot-backend --image desk-bot-backend

# Database: Cloud SQL / RDS
# Vector DB: Managed Chroma / Pinecone
# Cache: Cloud Memorystore
```

## 📚 Memory System Deep Dive

### Why Multi-User Memory Matters

Each user should have:
1. **Isolated memory store** - User data never mixed
2. **Privacy guarantee** - User A can't see User B's interactions
3. **Personalized responses** - Bot recalls user-specific context

### Memory Types

```
1. Profile Memory (Static)
   - User preferences
   - Work style
   - Topics of interest
   - Stored in: Users table

2. Conversation History (Sequential)
   - Full chat logs
   - Timestamps
   - Stored in: ChatMessages table

3. Semantic Memory (Vectorized)
   - "User likes coffee" + embedding
   - "User works in marketing" + embedding
   - Stored in: Vector database
   - Retrieved via similarity search

4. Contextual Memory (Temporary)
   - Last 5 messages
   - Current task context
   - Stored in: Cache (Redis)
   - Cleared after session
```

### Memory Retrieval Pipeline

```
Upon each message:

1. Load User Profile
   └─ Get personality, interests, preferences

2. Fetch Recent Context (Last 5-10 messages)
   └─ For immediate conversational continuity

3. Semantic Search
   └─ "What does the system know about this topic for THIS user?"
   └─ Query vector DB with user ID filter
   └─ Get top 3-5 relevant memories

4. Inject into Prompt
   └─ "Given user's personality, context, and prior knowledge..."

5. Generate Response
   └─ Gemini API with rich context

6. Update Memory
   └─ Save important learnings to vector DB
   └─ Update recent context
```

### Implementation Pseudocode

```typescript
async function chatWithMemory(
  userId: string,
  userMessage: string
): Promise<string> {
  // 1. Fetch user profile
  const user = await getUserProfile(userId);
  
  // 2. Fetch recent chat (context window)
  const recentChat = await getChatHistory(userId, limit: 5);
  
  // 3. Vector search for relevant memories
  const memories = await vectorDB.search(
    query: userMessage,
    user_id: userId, // CRITICAL: User isolation
    limit: 5
  );
  
  // 4. Build context-rich prompt
  const prompt = buildPrompt({
    systemInstruction: user.personality,
    userProfile: user,
    recentContext: recentChat,
    relevantMemories: memories,
    userMessage: userMessage,
  });
  
  // 5. Call LLM
  const response = await gemini.generate(prompt);
  
  // 6. Store response in chat history
  await saveChatMessage(userId, userMessage, response);
  
  // 7. Extract and store new learnings
  const newMemories = await extractMemories(
    user_id: userId,
    response: response
  );
  await vectorDB.store(newMemories);
  
  return response;
}
```

## 🧪 Testing the Prototype

### Manual Testing Checklist

- [ ] Register first user → face captures → chat opens
- [ ] Register second user with different personality
- [ ] Face login recognizes both users correctly
- [ ] Chat works with Gemini API key configured
- [ ] Personality affects response tone
- [ ] Chat history persists on page reload
- [ ] Clear chat removes all messages
- [ ] Delete user removes profile
- [ ] Webcam toggle hides/shows camera feed
- [ ] Mobile responsive layout works

### Testing Users (Pre-created)

Create test users with different personalities:

1. **Alice** - Friendly personality
   - Test: Casual questions
   - Expected: Warm, emoji-using responses

2. **Bob** - Formal personality
   - Test: Work questions  
   - Expected: Professional, structured answers

3. **Charlie** - Energetic personality
   - Test: General knowledge
   - Expected: Enthusiastic, exclamation marks

## 📖 API Documentation

### POST /api/chat

**Request:**
```typescript
{
  message: string;              // User's message
  userName: string;             // User's full name
  userNickname?: string;        // Optional nickname
  personality: "friendly" | "formal" | "energetic" | "calm";
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;              // Assistant's response
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the weather?",
    "userName": "John",
    "userNickname": "Johnny",
    "personality": "friendly"
  }'
```

## 🐛 Troubleshooting

### Issue: "No face detected"
**Solution:**
- Ensure adequate lighting
- Position face clearly in center
- Check webcam permissions
- Try in a different browser if Chrome blocks access

### Issue: "Face recognition not loading"
**Solution:**
- Verify `public/models/` directory exists
- Check browser console for 404 errors on model files
- Download models from face-api.js GitHub repo
- Clear browser cache

### Issue: "API key invalid"
**Solution:**
- Verify API key in `.env.local` (no spaces)
- Check Gemini API is enabled in Google Cloud Console
- Ensure API key has Generative AI access

### Issue: "localStorage full"
**Solution:**
- Clear chat history via UI
- Delete unused user profiles
- Use IndexedDB for larger storage (implement alternative)

### Issue: Face recognition matches wrong user
**Solution:**
- Re-register the user with better lighting
- Ensure face is clearly visible
- Check confidence threshold in `lib/face-recognition.ts`
- Try different angles during registration

## 📝 Environment Variables

```bash
# .env.local

# Gemini API Configuration
GEMINI_API_KEY=your_api_key_here

# API URL (for production)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Logging
DEBUG=desk-bot:*
```

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [face-api.js](https://github.com/vladmandic/face-api)
- [Google Gemini API](https://ai.google.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs)

## 📄 License

MIT License - Feel free to use and modify for personal/educational purposes.

## 🤝 Contributing

This is a prototype project. For extensions/modifications:

1. Create feature branches
2. Test thoroughly (especially face recognition accuracy)
3. Update README with changes
4. Ensure privacy guarantees remain (no data leaks!)

## 🎯 Success Metrics

A successful deployment demonstrates:

- ✅ Face registration works without errors
- ✅ Face recognition has >80% accuracy (same lighting)
- ✅ Chat responses are personalized to personality
- ✅ UI feels smooth and responsive
- ✅ No console errors (check browser DevTools)
- ✅ All pages load within 3 seconds
- ✅ Works on mobile browsers

## 🚀 Next Steps for Production

1. **Add Real Database**
   - Replace localStorage with PostgreSQL
   - Version and backup chat histories

2. **Implement Memory System**
   - Add vector database (Chroma/FAISS)
   - Enable long-term user memories
   - Add memory retrieval before each response

3. **Scale Backend**
   - Deploy separate backend service
   - Add load balancing
   - Implement rate limiting

4. **Enhance Security**
   - Add user authentication
   - Encrypt localStorage data
   - Add CORS configuration

5. **Hardware Integration**
   - Develop Raspberry Pi client
   - Add speaker output
   - Implement robot animations
   - Add microphone input

---

**Built with ❤️ as a hackathon prototype for a personalized desk bot assistant**

For questions or support, open an issue in the repository.
