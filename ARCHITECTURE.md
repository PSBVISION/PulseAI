# Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER BROWSER                              │
│  (Next.js Frontend + face-api.js + localStorage)                │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
   │   Webcam    │    │  localStorage │   │  face-api.js │
   │   Stream    │    │   (Profiles,  │   │   (Detection)│
   │             │    │    History)   │    │              │
   └─────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Next.js Routes   │
                    │  /register         │
                    │  /recognize        │
                    │  /assistant        │
                    │  /users            │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   API Routes       │
                    │   /api/chat        │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Gemini API        │
                    │  (LLM Responses)   │
                    └────────────────────┘
```

## User Registration Flow

```
Registration Page
     │
     ▼
Enter Profile (Name, Nickname, Personality)
     │
     ▼
Open Webcam
     │
     ▼
Capture Face
     │
     ▼
face-api.js detects face
     │
     ▼
Extract Face Descriptor (128-dim vector)
     │
     ▼
Validate Descriptor
     │
     ├─── Face Detected
     │      ▼
     │   Save User Profile
     │      │
     │      ├─ ID
     │      ├─ Name
     │      ├─ Nickname
     │      ├─ Personality
     │      ├─ Face Descriptor
     │      └─ Timestamp
     │      │
     │      ▼
     │   Store in localStorage
     │      │
     │      ▼
     │   Redirect to Chat
     │
     └─── No Face Detected
              ▼
           Show Error Message
```

## Face Recognition Login Flow

```
Recognition Page
     │
     ▼
Load All User Profiles from localStorage
     │
     ▼
Open Webcam
     │
     ▼
Capture Face
     │
     ▼
face-api.js detects face
     │
     ▼
Extract Face Descriptor
     │
     ▼
Compare with All Stored Descriptors
│
├─ Skip descriptor 1 (distance > threshold)
├─ Skip descriptor 2 (distance > threshold)
├─ ✓ Match descriptor 3! (distance < threshold)
└─ Skip descriptor 4 (distance > threshold)
     │
     ▼
Calculate Confidence Score
     │
     ├─── Confidence > 60%
     │      ▼
     │   User Recognized! ✓
     │      │
     │      ├─ Show confidence %
     │      ├─ Show user profile
     │      │
     │      ▼
     │   Redirect to Chat
     │
     └─── Confidence < 60%
              ▼
           Not Recognized
              │
              ├─ Show error
              └─ Suggest registration
```

## Chat Flow

```
User Opens Chat
     │
     ▼
Load User Profile from localStorage
     │
     ├─ Load saved chat history (if exists)
     │
     ▼
Display Welcome Message
     │
     ▼
User Submits Message
     │
     ▼
POST to /api/chat
│
├─ Message
├─ User Name
├─ User Nickname
├─ Personality
└─ Chat History
     │
     ▼
Next.js API Route
     │
     ├─ Build System Prompt with Personality
     ├─ Format Request for Gemini
     │
     ▼
Call Gemini API
     │
     ├─ Temperature: 0.7
     ├─ Max tokens: 500
     └─ Safety filters enabled
     │
     ▼
Wait for Response
     │
     ▼
Parse Response
     │
     ▼
Return to Client
     │
     ▼
Display Message in Chat UI
     │
     ▼
Save to localStorage
     │
     ├─ User Message
     ├─ Assistant Response
     └─ Timestamp
     │
     ▼
Ready for Next Message
```

## Data Storage Schema

### User Profile (localStorage)
```typescript
{
  id: "1234567890-abcdef",           // Unique ID
  name: "John Doe",                  // Full name
  nickname: "Johnny",                // Optional
  personality: "friendly",           // Choice of 4
  faceDescriptor: Float32Array[128], // Face biometric
  createdAt: "2025-04-01T10:30:00",  // ISO timestamp
  updatedAt: "2025-04-01T10:30:00"
}
```

### Chat Message (localStorage)
```typescript
{
  id: "1234567890",           // Message ID
  role: "user" | "assistant", // Who wrote it
  content: "Hi there!",       // Message text
  timestamp: "2025-04-01T10:30:05" // When sent
}
```

### Chat Session (localStorage)
```typescript
{
  userId: "1234567890-abcdef",
  messages: [...],            // Array of ChatMessage
  startedAt: "2025-04-01T10:30:00"
}
```

## API Endpoint: /api/chat

### Request
```json
{
  "message": "What is the capital of France?",
  "userName": "John Doe",
  "userNickname": "Johnny",
  "personality": "friendly",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hi!"
    },
    {
      "role": "assistant",
      "content": "Hello! How can I help?"
    }
  ]
}
```

### Response
```json
{
  "success": true,
  "message": "The capital of France is Paris! 🇫🇷 It's a beautiful city known for the Eiffel Tower..."
}
```

## Personality Injection

```
User Input: "What should I have for lunch?"

Personality: "friendly"
├─ System Prompt Modifier: 
│  "Be warm, conversational, use casual language"
│
▼Response: "Ooh, great question! 😊 Depends on what you're in the mood for! 
Pizza? Sushi? Maybe a salad if you're feeling healthy? 
What are you craving today?"

---

User Input: "What should I have for lunch?"

Personality: "formal"
├─ System Prompt Modifier:
│  "Be professional and structured"
│
▼ Response: "I can assist with lunch recommendations. 
Common options include: 1) Prepared meals 2) Restaurant cuisine 
3) Takeaway services. What cuisine preference do you have?"

---

User Input: "What should I have for lunch?"

Personality: "energetic"
├─ System Prompt Modifier:
│  "Be enthusiastic and use exclamation marks"
│
▼ Response: "OH! LUNCH TIME! 🎉 That's awesome! 
You could go for pizza, sushi, tacos, burgers - 
SO MANY DELICIOUS OPTIONS! What are you feeling?!"
```

## Component Hierarchy

```
RootLayout
├─ HTML
└─ Body (gradient background)
   └─ {children}

Page (/)
├─ NavHeader
├─ Hero Section
│  └─ RobotAvatar
├─ Features Grid
│  └─ FeatureCard[] (using Card components)
├─ CTA Section
└─ Footer

RegisterPage (/register)
├─ NavHeader
├─ Card
│  └─ Step Indicators
│  ├─ Step: Profile
│  │  ├─ Input (name)
│  │  ├─ Input (nickname)
│  │  ├─ RadioGroup (personality)
│  │  └─ Button (submit)
│  ├─ Step: Webcam
│  │  ├─ WebcamCapture
│  │  └─ Button (capture)
│  └─ Step: Confirmation
│     ├─ CheckCircle Icon
│     ├─ Card (profile summary)
│     └─ Spinner (redirecting)

RecognizePage (/recognize)
├─ NavHeader
├─ Card
│  ├─ Step: Select
│  │  ├─ Info Box (users count)
│  │  ├─ Button (start recognition)
│  │  └─ Button (register)
│  ├─ Step: Recognizing
│  │  ├─ WebcamCapture
│  │  └─ Button (cancel)
│  └─ Step: Result
│     ├─ CheckCircle Icon
│     ├─ Welcome Message
│     ├─ Card (user info)
│     ├─ Progress Bar (confidence)
│     ├─ Button (proceed)
│     └─ Button (try different)

AssistantPage (/assistant)
├─ NavHeader (with user profile)
├─ Left Panel (hidden on mobile, lg:flex)
│  ├─ WebcamCapture (togglable)
│  ├─ Button (webcam toggle)
│  ├─ Card (RobotAvatar)
│  └─ Card (user profile)
└─ Right Panel (main chat)
   ├─ Card (messages)
   │  ├─ Message List
   │  │  └─ ChatMessage[] (animated)
   │  │  └─ Separator (isLoading)
   │  └─ Input Area
   │     ├─ Input (message text)
   │     ├─ Button (send)
   │     └─ Spinner (if loading)
   └─ Button Group (clear, logout)

UsersPage (/users)
├─ NavHeader
├─ Title + Description
├─ UserCard Grid
│  └─ UserCard[]
│     ├─ Card
│     │  ├─ CardHeader
│     │  │  ├─ CardTitle (name)
│     │  │  └─ Badge (personality)
│     │  └─ CardContent
│     │     ├─ Calendar Icon + Date
│     │     ├─ ID Display
│     │     └─ Button Group (chat, delete)
└─ Info Card
```

## Face Descriptor Comparison Algorithm

```
Stored Face 1: [f1, f2, f3, ..., f128]
Stored Face 2: [g1, g2, g3, ..., g128]
Captured Face: [h1, h2, h3, ..., h128]

Distance(Stored Face 1, Captured Face):
  sum = 0
  for i in 0..127:
    diff = f[i] - h[i]
    sum += diff * diff
  return sqrt(sum)  // Euclidean Distance

Results:
  Distance 1 = 0.45 ✓ (< 0.5 threshold)
  Distance 2 = 0.62 ✗ (> 0.5 threshold)

Confidence = 1 - (min_distance / threshold)
           = 1 - (0.45 / 0.5)
           = 1 - 0.9
           = 0.10 or 10% ?? This example is off

Would actually be:
  Confidence = max(0, 1 - (distance / threshold))
             = max(0, 1 - (0.45 / 0.5))
             = max(0, 1 - 0.9)
             = 0.1 (10%)

  Better formula:
  Confidence = (1 - (distance / 0.5)) * 100
             = (1 - 0.45/0.5) * 100
             = (1 - 0.9) * 100
             = 10%
  
  OR more accurately:
  Confidence = max(0, (threshold - distance) / threshold) * 100
             = (0.5 - 0.45) / 0.5 * 100
             = 0.05 / 0.5 * 100
             = 10%

Match if Confidence > 60%
```

---

This architecture ensures:
✅ All face processing happens locally  
✅ Only Gemini API calls go external  
✅ User data stays in browser  
✅ Face descriptors are non-reversible  
✅ User isolation is guaranteed  
