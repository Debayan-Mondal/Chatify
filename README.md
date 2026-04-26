# Chatify: Real-Time Messaging App

A feature-rich, full-stack real-time communication platform built with the **MERN** stack. **Chatify** enables seamless instant messaging, secure user authentication, and automated user onboarding.

---

## Features

* **Real-Time Messaging:** Instant message delivery and receipt using **Socket.io** for a low-latency experience.
* **End-to-End Encryption:** Implemented End-to-End Encryption using Elliptical Curve Diffie-Hellman secure key aggrement protocol. Both Text and Images are encrypted using AES-GCM algorithm
* * **AI-Message Summarizer:** Integrated an AI Message Summarizer with Dynamic Context-Aware NLP to remove Sensitive information before sending to backend for a secured Application.
* **Secure Authentication:** Robust user access control implemented via **JSON Web Tokens (JWT)** and password hashing.
* **Automated Onboarding:** Integration with the **Resend API** to automatically trigger welcome emails upon successful user registration.
* **User Status:** Real-time online/offline status indicators.
* **Persistent Conversations:** Chat history is securely stored in MongoDB and retrieved efficiently.

## Live Link:
https://chatify-qv8a.onrender.com/

---

## Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Real-Time Engine:** Socket.io
* **Email Service:** Resend API
* **Security:** JWT, Bcrypt.js
* **Encryption Algorithm:** AES-GCM
* **LLM:** GEMINI API (gemini-3.1-flash-lite-preview)

---

## Installation & Setup

### 1. Prerequisites
* Node.js installed
* MongoDB Atlas account or local instance
* Resend API Key
### 3. Create .env file with:
````bash
PORT = 3000
NODE_ENV = developement
MONGO_URI = your_mongodb_connection_string
JWT_SECRET=your_secrete_key
RESEND_API_KEY = your_resend_api_key
EMAIL_FROM = "onboarding@resend.dev"
EMAIL_FROM_NAME = "Chatify"
CLIENT_URL = http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret_key
````

### 3. Steps:
```bash
git clone https://github.com/Debayan-Mondal/Chatify
cd chatify
cd server
npm install
npm run dev
cd client
npm install
npm run dev
