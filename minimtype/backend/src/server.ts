import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Test } from "./models/Test";
import { User } from "./models/User";
import { loginUser } from "./auth/login";
import { registerUser } from "./auth/register";
import { createTests, deleteTest, getTests, updateTest } from "./utils/tests";
import { authenticateToken } from "./auth/authMiddleware";
import { deleteUser, updateUser } from "./utils/users";

dotenv.config({path: "../.env"});
const app = express();
app.use(express.json());
app.use(cors({origin: "http://localhost:5173"}));

const PORT = process.env.PORT || 5000;
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Auth routes
app.post("/auth/register", registerUser);
app.post("/auth/login", loginUser);



//Protected user routes
app.put('/user/:id', updateUser);
app.delete('/user/:id', deleteUser);

// Protected test routes
app.use("/tests", authenticateToken);
app.get("/tests/:id", getTests);
app.post("/tests", createTests);
app.put("/tests/:id", updateTest);
app.delete("/tests/:id", deleteTest);


const seedDatabase = async () => {
    await User.create([
      { user_email: "Alice@gmail.com", password: "pw123"},
      { user_email: "Bob@gmail.com", password: "pw1234"},
      { user_email: "Charlie@gmail.com", password: "pw12345"},
    ]);
    console.log("Sample data inserted");
  };
  // seedDatabase();



export default app;
  