// import express from 'express';
// import { Server } from 'socket.io';
// import http from 'http';
// import { initializeDB } from './database/db';
// import { saveMessage, getMessages } from './database/messageModal';
// import cors from 'cors';
// import authRoutes from './controller/authController';
// import { loginUser, registerUser } from './database/authModal';
// import { verifyToken } from './middleware/authMiddleware';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: { origin: '*' },
// });
// const generateKey = (): string =>
//     String(Math.floor(100000 + Math.random() * 900000));
// const PORT = process.env.PORT || 3002;
// const SECRET_KEY = 'your_secret_key';

// app.use(cors());
// app.use(express.json());
// app.use('/auth', authRoutes);

// const db = initializeDB();

// app.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const result = await registerUser(await db, username, password);
//         res.status(201).json(result);
//     } catch (error) {
//         res.status(400).json({ error: (error as Error).message });
//     }
// });

// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const result = await loginUser(await db, username, password);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(401).json({ error: (error as Error).message });
//     }
// });
// app.get('/messages', async (req, res) => {
//     try {
//         const messages = getMessages(await db);
//         res.json(
//             messages.map(({ key, content }: any) => ({
//                 key,
//                 ...JSON.parse(content),
//             }))
//         );
//     } catch (error) {
//         console.error('Error fetching messages:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// io.use(async (socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (!token) return next(new Error('Không có token'));

//     try {
//         const user = verifyToken(token);
//         (socket as any).user = user;
//         next();
//     } catch (error) {
//         next(new Error('Token không hợp lệ'));
//     }
// });
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('sendMessage', async (msg) => {
//         if (typeof msg !== 'string') {
//             return;
//         }
//         const trimmedMsg = msg.trim();

//         if (!trimmedMsg) {
//             return;
//         }
//         const key = generateKey();
//         const messageData = JSON.stringify({
//             message: msg,
//             executeTime: Date.now(),
//         });

//         saveMessage(await db, key, messageData);
//         io.emit('receiveMessage', { key, ...JSON.parse(messageData) });
//     });

//     socket.on('disconnect', () => console.log('User disconnected:', socket.id));
// });

// server.listen(PORT, () => {
//     console.log(`Server runnig at http://localhost:${PORT}`);
// });
import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { findUserByUsername, registerUser } from './database/authModal';

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key';

app.use(express.json());
app.use(cors());

app.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }
    await registerUser(username, password);
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Username already exists' });
  }
});

app.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});