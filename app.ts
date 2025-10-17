import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import reportRoute from "./routes/";
import cors from "cors";
import { connectDB } from "./db";

const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from your frontend
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow the Authorization header
  credentials: true, // Allow cookies (if needed)
};

const app = express();
const port = 3005;
console.log("APP");

connectDB();

app.use(express.json());
app.use(cors());

const API_KEY = "my-secret-123";

app.use(reportRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: "An error ocured" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
