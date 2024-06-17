import app from "./app";
import databaseConnection from "./configs/database";
import envConfig from "./configs/envConfig";

const PORT = envConfig.port || 3001;

// Connect to the database
databaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT} 🏃...`);
    });
  })
  .catch((error: any) => {
    console.error("Database connection error ⚠️:", error?.message);
    process.exit(1);
  });
