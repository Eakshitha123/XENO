import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import routes from "./routes.js";
import authRoutes from "./authRoutes.js"; // import auth routes
import aiRoutes from "./aiRoutes.js";


const app = express();

// ---------------- Middleware ----------------
app.use(cors({
  origin: "http://localhost:3000", // your frontend
  credentials: true,
}));
app.use(bodyParser.json());

app.use("/api/ai", aiRoutes);
// ---------------- Sessions ----------------
app.use(
  session({
    secret: "your_secret_key", // change this
    resave: false,
    saveUninitialized: true,
  })
);

// ---------------- Passport ----------------
app.use(passport.initialize());
app.use(passport.session());

// ---------------- Routes ----------------
app.use("/api", routes);
app.use("/api/auth", authRoutes); // auth routes

// ---------------- MongoDB & Server ----------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://eakshithacheppali:tUrNeGTv4i8ASnpE@cluster0.g9oht.mongodb.net/hostelAssist?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
