// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { body, validationResult } from 'express-validator';
// import User from '../models/User.js'; 
// const router = express.Router();

// router.post(
//   '/register',
//   [
//     body('name').not().isEmpty().withMessage('Name is required'),
//     body('email').isEmail().withMessage('Enter a valid email'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, email, password } = req.body;

//     try {
//       let user = await User.findOne({ email });
//       if (user) {
//         return res.status(400).json({ msg: 'User already exists' });
//       }

//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       user = new User({
//         name,
//         email,
//         password: hashedPassword,
//       });

//       await user.save();

//       const payload = { userId: user.id };
//       const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
//       res.json({ token });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

// // Login Route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const payload = { userId: user.id };
//     const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

//     res.json({ token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// export default router;
