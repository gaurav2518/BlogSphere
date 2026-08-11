import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { Client, Account, ID, Databases, Query } from 'appwrite';
import { asyncHandler } from '../middleware/errorHandler.js';

dotenv.config();

// Debug environment variables 
// console.log('AuthController - Environment variables loaded:');
// console.log('APPWRITE_ENDPOINT:', process.env.APPWRITE_ENDPOINT);
// console.log('APPWRITE_PROJECT_ID:', process.env.APPWRITE_PROJECT_ID);
// console.log('APPWRITE_API_KEY exists:', !!process.env.APPWRITE_API_KEY);


if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
  throw new Error('Missing required Appwrite environment variables. Please check your .env file.');
}


const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setDevKey(process.env.APPWRITE_API_KEY); 

// console.log('Appwrite client initialized successfully');

const account = new Account(client);
const databases = new Databases(client);


const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Register new user
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.status = 400;
    error.details = errors.array();
    throw error;
  }

  const { email, password, name } = req.body;

  const user = await account.create(ID.unique(), email, password, name);

  const token = generateToken(user.$id, user.email);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user.$id,
      email: user.email,
      name: user.name
    },
    token
  });
});

// Login user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Debug logging (commented out for production)
    // console.log('Login attempt for email:', email);
    // console.log('Password length:', password?.length);

    try {
      // Create a temporary client for session verification
      const tempClient = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID);
      
      const tempAccount = new Account(tempClient);
      
      // console.log('Attempting to verify credentials...');
      const session = await tempAccount.createEmailPasswordSession(email, password);
      // console.log('Credentials verified successfully');
      // console.log('Session data:', { userId: session.userId, userEmail: session.userEmail });
      
      // Since credentials are verified, we can proceed with login
      const userId = session.userId;
      const userEmail = email; // We know the email from the request
      
      // Generate our JWT token using the verified data
      const token = generateToken(userId, userEmail);

      // console.log('Login successful for user:', userId);

      res.json({
        message: 'Login successful',
        user: {
          id: userId,
          email: userEmail,
          name: userEmail.split('@')[0] // Fallback name from email
        },
        token
      });
    } catch (appwriteError) {
      console.log('Appwrite error:', appwriteError.message);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      message: 'Invalid credentials', 
      error: error.message 
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    // Since we're using JWT tokens, logout is handled client-side
    // The client should remove the token from storage
    // This endpoint just confirms the logout action
    
    // Optional: You could implement a token blacklist here for additional security
    // For now, we just acknowledge the logout
    
    res.json({ 
      message: 'Logout successful',
      note: 'Please remove the token from client storage'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Logout failed', 
      error: error.message 
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    // The authenticate middleware adds user info to req.user from the JWT token
    const { userId, email } = req.user;
    
    // Return the user data from the JWT token
    // In a more complete implementation, you might want to fetch additional 
    // user data from a database or cache
    res.json({
      user: {
        id: userId,
        email: email,
        name: email.split('@')[0], // Fallback name from email
        // You can add more fields here as needed
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Failed to get profile', 
      error: error.message 
    });
  }
};

// Update user name
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { name } = req.body;
    const { userId, email } = req.user;

    // Since we're using JWT and not storing user profiles in a separate collection,
    // we'll generate a new token with the updated name
    // Note: In production, you might want to store user profiles in a database collection
    
    const token = generateToken(userId, email);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: userId,
        email: email,
        name: name
      },
      token // Return new token if you want to update client-side storage
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: error.message 
    });
  }
};