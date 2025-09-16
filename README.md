Xenocrm - Customer Campaign Management System

Xenocrm is a CRM web application that allows businesses to manage customer segments, run campaigns, and leverage AI-driven insights. Built with MERN stack, it includes Google OAuth authentication and campaign messaging with delivery logging.

Local Setup Instructions
Backend

Clone the repo and install dependencies:

git clone <repo-url>
cd backend
npm install


Create .env file with:

GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
MONGO_URI=<your-mongo-uri>


Start backend server:

npm run dev

Frontend

Navigate to frontend and install dependencies:

cd ../frontend
npm install


Start frontend:

npm start


Open http://localhost:3000 in your browser.

Tech & AI Summary

Frontend: React, React Router

Backend: Node.js, Express.js

Database: MongoDB (Atlas/local)

Authentication: Google OAuth 2.0 via Passport.js

Campaign Messaging: Simulated vendor API with delivery logging

AI Feature: Auto-suggest campaign messages based on campaign objective



