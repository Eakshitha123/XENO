import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const router = express.Router();

// -------------------- Passport Google Strategy --------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: "913717104528-9q108d52v492nfmovitgjdp3jjcjlql2.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Here, you can save or find the user in your DB
      const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };
      done(null, user);
    }
  )
);

// Serialize & deserialize user for sessions
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// -------------------- Auth Routes --------------------

// Initiate Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "http://localhost:3000/login-success",
  })
);

// Success/failure pages
router.get("/success", (req, res) => {
  res.json({ message: "✅ Login successful", user: req.user });
});

router.get("/failure", (req, res) => {
  res.status(401).json({ message: "❌ Login failed" });
});

export default router;
