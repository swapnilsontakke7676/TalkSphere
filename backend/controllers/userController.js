const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const nodemailer = require("nodemailer");

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please enter all required fields" });
    return;
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    profilePic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/user/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// POST /forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Find the user by their email address in the database.
    const user = await User.findOne({ email });

    // If no user is found, return a 404 error.
    if (!user) {
      return res.status(404).json({ message: "User with that email does not exist." });
    }

    // ✅ Generate a secure 6-digit OTP.
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }

    const otp = generateOTP();
    user.resetOTP = otp;
    // Set the OTP to expire in 10 minutes.
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // ✅ Configure Nodemailer to send emails via Gmail.
    // It's recommended to use environment variables for credentials.
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env
        pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
      },
    });

    // ✅ Modern, responsive, and professional HTML email template.
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
            /* Basic Reset */
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: #f8f9fa; }
            /* Main Wrapper */
            .wrapper { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
            /* Card */
            .card { background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; }
            /* Card Content */
            .card-content { padding: 30px 40px; }
            /* Logo */
            .logo { text-align: center; margin-bottom: 30px; }
            .logo img { max-width: 150px; }
            /* Headings & Text */
            h1 { font-size: 24px; font-weight: 600; color: #333333; text-align: center; margin-top: 0; margin-bottom: 20px; }
            p { font-size: 16px; color: #555555; line-height: 1.6; }
            /* OTP Section */
            .otp-section { text-align: center; margin: 35px 0; }
            .otp-code { display: inline-block; background-color: #e9ecef; color: #0d6efd; font-size: 32px; font-weight: 700; letter-spacing: 5px; padding: 15px 30px; border-radius: 8px; border: 1px dashed #adb5bd; }
            /* Footer */
            .footer { background-color: #f1f3f5; padding: 25px 40px; text-align: center; }
            .footer p { margin: 0; font-size: 13px; color: #888888; }
            .footer a { color: #0d6efd; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="card">
                <div class="card-content">
                    <div class="logo">
                        <!-- IMPORTANT: Replace with your actual logo URL -->
                        <img src="https://placehold.co/150x50/4A90E2/FFFFFF?text=TalkSphere" alt="TalkSphere Logo">
                    </div>
                    
                    <h1>Your Password Reset Code</h1>
                    
                    <p>Hello <strong>${user.name || "there"}</strong>,</p>
                    
                    <p>We received a request to reset the password for your TalkSphere account. Please use the One-Time Password (OTP) below to proceed.</p>
                    
                    <div class="otp-section">
                        <span class="otp-code">${otp}</span>
                    </div>
                    
                    <p style="font-size: 14px; text-align: center;">This code is valid for <strong>10 minutes</strong>. For your security, please do not share this code with anyone.</p>
                    
                    <p style="font-size: 14px; text-align: center;">If you did not request a password reset, you can safely ignore this email.</p>
                </div>
                
                <div class="footer">
                    <p>© ${new Date().getFullYear()} TalkSphere. All rights reserved.<br>123 Sphere Street, Communication City, World</p>
                    <p style="margin-top: 10px;">
                        <!-- IMPORTANT: Replace with your website URL -->
                        <a href="https://example.com">Visit our website</a>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // ✅ Send the email with the defined transport and template.
    await transporter.sendMail({
      from: `"TalkSphere" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🔑 Your TalkSphere Password Reset Code",
      html: htmlTemplate,
    });

    res.status(200).json({ message: "OTP has been sent to your email address." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: error.message || "An internal server error occurred." });
  }
};

// POST /verify-reset-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }


    if (String(user.resetOTP) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOTPExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// POST /reset-password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.resetOTP !== otp)
    return res.status(400).json({ message: "Invalid OTP" });
  if (user.resetOTPExpires < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  user.password = newPassword; // plain password
  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;
  await user.save(); // hashing happens here in pre-save hook

  res.status(200).json({ message: "Password reset successful" });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
