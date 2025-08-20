
import allowedOrigins from "./allowOrigin";
const corsOptions = {
  origin: (origin: any, callback: any): void => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

export default corsOptions;
