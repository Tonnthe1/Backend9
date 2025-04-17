import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../utils/emailService';
import fs from 'fs';
import path from 'path';

export const signup = async (req: Request, res: Response) => {
  try {
    console.log("Received signup request with body:", req.body);
    console.log("Received file:", req.file);

    const { name, email, password } = req.body;
    
    // Convert email to lowercase
    const lowercaseEmail = email.toLowerCase();
    
    // Check if user already exists
    let user = await User.findOne({ email: lowercaseEmail });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let profilePicData;
    if (req.file) {
      profilePicData = {
        data: fs.readFileSync(path.join(__dirname, '..', req.file.path)),
        contentType: req.file.mimetype
      };
    }

    // Create new user
    user = new User({
      name,
      email: lowercaseEmail,
      password,
      profilePic: profilePicData
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    console.log("User created successfully:", user);

    // Create and sign JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '1h' }
    );

    // Send welcome email
    try {
      await sendWelcomeEmail(lowercaseEmail, password);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Note: We're not stopping the signup process if email fails
    }

    // Send response
    res.status(201).json({ token, message: 'User created successfully' });

  } catch (error: unknown) {
    console.error("Error in signup:", error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Convert email to lowercase
    const lowercaseEmail = email.toLowerCase();

    let user = await User.findOne({ email: lowercaseEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.json({ token });
  } catch (error: unknown) {
    console.error("Error in login:", error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};