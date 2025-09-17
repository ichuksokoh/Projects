import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { ITest, Test } from "./models/Test";
import { User } from "./models/User";
import { loginUser } from "./auth/login";
import { registerUser } from "./auth/register";
import { createTests, deleteTest, getTests, updateTest } from "./utils/tests";
import { authenticateToken } from "./auth/authMiddleware";
import { deleteUser, getUser, updateUser } from "./utils/users";
import { refreshToken } from "./auth/refreshToken";
import cookieParser from 'cookie-parser';
import { logout_refreshToken } from "./auth/logout";

dotenv.config({path: "../.env"});
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({origin: ["http://192.168.1.204:5173", "http://localhost:5173"],
              credentials: true,
}));

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '127.0.0.1';
const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


//testing routes
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
  });

app.listen(PORT, HOST as string, () => {
  console.log(`Server running on port ${PORT}`);
});


// Auth routes
app.post("/auth/register", registerUser);
app.post("/auth/login", loginUser);
app.post("/auth/refresh_token", refreshToken);
app.delete("/auth/refresh_token", logout_refreshToken);



//Protected user routes
app.use('/user', authenticateToken);
app.put('/user/:id', updateUser);
app.delete('/user/:id', deleteUser);
app.get('/user/:id', getUser);

// Protected test routes
app.use("/tests", authenticateToken);
app.get("/tests/:id", getTests);
app.post("/tests", createTests);
app.put("/tests/:id", updateTest);
app.delete("/tests/:id", deleteTest);


const seedDatabase = async () => {
    const query = {user_id: "FJbSoG9zw3ThLEIg8Kqb9"}
    const tests = await Test.find(query);
    console.log(tests);
    // await Test.create([
    //   { user_email: "Alice@gmail.com", wpm: 30, raw_wpm: 40, graph_data: [[9]], accuracy: 90, user_id: "FJbSoG9zw3ThLEIg8Kqb9"},
    // ]);
    // console.log("Sample data inserted");
  };
  // seedDatabase();



export default app;
  