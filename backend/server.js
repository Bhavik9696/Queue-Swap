const express=require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const helperRoutes = require('./routes/helpers');

const app=express();

app.use(express.json());

app.use(helmet());

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));


app.get("/",(req,res)=>{
    res.json({msg:"Queue-Swap"})
})

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/helpers', helperRoutes);




const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, methods: ['GET','POST'] }
});


io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  socket.user = { id: token };
  next();
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  if (socket.user?.id) socket.join(`user:${socket.user.id}`);

  socket.on('joinBookingRoom', (bookingId) => {
    socket.join(`booking:${bookingId}`);
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
});


app.set('io', io);


mongoose.connect(process.env.DB_URI).then(()=>{
  console.log("✅ MongoDB connected");
  
app.listen(process.env.PORT || 5000,()=>{
  console.log(`server running on port http://localhost:${process.env.PORT}`);
});

}).catch((err)=>{
   console.error("❌ MongoDB connection error:", err);
})