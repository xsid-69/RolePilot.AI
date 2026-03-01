# RolePilot.AI – RAG-Based Intelligent Persona Assistant

> **Elevate your AI interactions with dynamic, context-aware, and highly specialized AI personas.**

---

## 🌟 Vision & Overview

RolePilot.AI is a sophisticated full-stack AI platform designed to transform how users interact with Large Language Models. Instead of engaging with a generic, faceless AI, RolePilot.AI offers a suite of **specialized personas**—ranging from a seasoned Senior Software Engineer and a meticulous Career Mentor, to an imaginative Mystic Astrologer.

The application leverages the cutting-edge capabilities of **Google Gemini**, injecting rich personality matrices, speaking styles, and strict behavioral rules into the AI context. Users can converse with public system personas or forge their own custom characters, tailoring the AI's behavior to specific use cases like technical interviewing, trip planning, or emotional support.

Built on a robust architecture featuring **Node.js, Express, React, and MongoDB**, RolePilot.AI integrates **Socket.io** to provide seamless, real-time typing experiences, while utilizing **Pinecone** for advanced vector-based knowledge retrieval. It handles complex interactions intelligently, requiring the AI to use domain-specific metaphors even when a query falls outside its specialized expertise.

---

## 🚀 Live Demo

[**🔴 Live Link**](https://rolepilotai-omega.vercel.app/)


---

## 💻 Technologies Used

### Frontend

| Technology                | Description                                                                         |
| :------------------------ | :---------------------------------------------------------------------------------- |
| **React (Vite)**          | Ensures lightning-fast development builds and highly optimized production bundles.  |
| **TailwindCSS**           | Provides utility-first styling for a completely bespoke, glassmorphism-inspired UI. |
| **Socket.io-Client**      | Establishes persistent websocket connections for real-time generative AI responses. |
| **Zustand / Context API** | Manages global user authentication and application state predictably.               |

### Backend

| Technology                        | Description                                                                            |
| :-------------------------------- | :------------------------------------------------------------------------------------- |
| **Node.js & Express**             | Powers a scalable, non-blocking REST API and WebSocket server infrastructure.          |
| **Google GenAI (Gemini SDK)**     | The core brain driving the AI responses, instructed dynamically per persona.           |
| **Socket.io**                     | Manages bidirectional, event-driven communication between the server and the frontend. |
| **Passport.js & JSON Web Tokens** | Secure, dual-strategy authentication (Local Credentials + Google OAuth 2.0).           |

### Database & Specialized Tools

| Technology             | Description                                                                          |
| :--------------------- | :----------------------------------------------------------------------------------- |
| **MongoDB (Mongoose)** | Flexible NoSQL schema for storing users, chat logs, and custom AI personas.          |
| **Pinecone Vector DB** | (Vector Service) Allows for long-term memory capabilities and contextual embeddings. |

---

## ✨ Features

### 🧑‍💻 User Features

- **Secure Authentication:** Seamlessly sign up via standard email/password or use One-Click Google OAuth.
- **Custom AI Personas:** Design your own AI agents with specific roles, personality traits, and strict behavioral rules.
- **Real-Time Interactive Chat:** Converse instantly with AI with real-time socket connections and Markdown-rendered responses.
- **Comprehensive Chat History:** Access an elegant, scroll-triggered "Conversation Archive" to resume any past sessions.
- **Profile Management:** Update personal information, bio, password, and job title effortlessly.

### ⚙️ Special Functionalities

- **Dynamic System Instructions:** Translates complex persona rules into strict AI system prompts under the hood.
- **Graceful Out-of-Domain Handling:** Instructs the AI to explain foreign concepts using metaphors relevant to its current role (e.g., A doctor explaining computer viruses as biological pathogens).
- **Retrieval-Augmented Generation (RAG):** Implements advanced contextual long-term memory by converting conversations into mathematical embeddings stored in a Pinecone vector database. The system intelligently queries this vectorized memory space to inject semantically relevant past interactions into the AI's current context window.

---

## 📸 Screenshots

_(Replace the placeholder links with actual images once deployed)_

|                                         Welcome Screen                                         |                                         Chat Interface                                         |
| :--------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: |
| <img src="https://via.placeholder.com/600x400?text=Sign+In+Screen" alt="Sign In" width="400"/> | <img src="https://via.placeholder.com/600x400?text=Chat+Interface" alt="Chat UI" width="400"/> |

|                                            Persona Builder                                            |                                     Conversation Archive                                     |
| :---------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: |
| <img src="https://via.placeholder.com/600x400?text=Create+Persona" alt="Create Persona" width="400"/> | <img src="https://via.placeholder.com/600x400?text=Chat+History" alt="History" width="400"/> |

---

## 🛠️ How to Run Locally

### Prerequisites

Make sure you have **Node.js (v18+)** and **MongoDB** installed on your machine. You will also need API keys from Google Gemini and Pinecone.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/rolepilot.ai.git
cd rolepilot.ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure your `.env` variables (see below), then start the server:

```bash
npm run dev
```

_To seed the default system personas, run:_ `node src/scripts/seedPersonas.js`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The application will be running on `http://localhost:5173`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GEMINI_API_KEY=your_google_ai_studio_api_key
PINECONE_API_KEY=your_pinecone_vector_db_key
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.development` & `frontend/.env.production`)

```env
# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://rolepilot-backend.onrender.com
```

---

## 📂 Project Structure

```text
rolepilot.ai/
│
├── backend/
│   ├── src/
│   │   ├── config/        # Passport & Strategy configurations
│   │   ├── controllers/   # Auth, Chat, and Persona logic
│   │   ├── db/            # Database connection handlers
│   │   ├── models/        # Mongoose Schemas (User, Persona, Chat, Message)
│   │   ├── routes/        # Express API endpoints
│   │   ├── scripts/       # Seeding and maintenance scripts
│   │   ├── services/      # Gemini AI, Vector DB, and Prompt builders
│   │   └── sockets/       # Socket.io real-time connection logic
│   └── app.js & Server.js
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components (Header, PersonaCard, etc.)
    │   ├── context/       # Global State management (UserContext)
    │   └── pages/         # Full Views (Layout, SignIn, SignUp, Profile)
    ├── vite.config.js
    └── index.css          # Global Tailwind and custom styles
```

---

## 🏗️ Architecture & Request Flow

1. **Client Action:** The user sends a chat message via the React interface.
2. **Real-time Transport:** The message is emitted over WebSockets via `socket.io-client` to the Node.js Backend.
3. **Context Assembly:** The Backend's `promptBuilder.service.js` looks up the selected Persona and the User's profile, assembling a highly detailed `systemInstruction` prompt.
4. **AI Generation:** The constructed payload is sent to Google's Gemini Flash model via the `ai.service.js`.
5. **Stream/Response Return:** Gemini generates a role-played response. The backend receives it and pushes the data back to the frontend over the open Socket connection.
6. **Rendering:** The frontend applies Markdown formatting and displays the AI's response in real-time.

---

## 🗄️ Database Schema

### `User` Table

| Field        | Type     | Description               |
| :----------- | :------- | :------------------------ |
| `_id`        | ObjectId | Primary Key               |
| `email`      | String   | Unique email identifier   |
| `password`   | String   | Hashed credentials        |
| `fullName`   | Object   | `{ firstName, lastName }` |
| `profilePic` | String   | Avatar URL                |

### `Persona` Table

| Field               | Type     | Description                         |
| :------------------ | :------- | :---------------------------------- |
| `_id`               | ObjectId | Primary Key                         |
| `name`              | String   | Persona's designated name           |
| `role`              | String   | Job/role of the persona             |
| `personalityTraits` | Array    | Tags defining the personality       |
| `rules`             | Array    | Strict operational behavioral rules |
| `visibility`        | String   | 'public' or 'private'               |

### `Chat` & `Message` Tables

| Field     | Type     | Description                 |
| :-------- | :------- | :-------------------------- |
| `_id`     | ObjectId | Primary Key                 |
| `user`    | ObjectId | Ref to `User`               |
| `persona` | ObjectId | Ref to `Persona`            |
| `title`   | String   | Auto-generated chat name    |
| `content` | String   | (Message) The text payload  |
| `role`    | String   | (Message) 'user' or 'model' |

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
