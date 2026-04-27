import app from "./app";
import { initializeDatabase } from "./config/db";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    app.listen(env.PORT, () => {
      console.log(`Server running at http://localhost:${env.PORT}`);
      console.log(`API base path: http://localhost:${env.PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error);
    process.exit(1);
  }
};

void startServer();
