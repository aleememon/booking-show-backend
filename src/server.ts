import app from "./app/app.js";
import "dotenv/config";

const PORT = process.env.PORT ?? 8080;
const start = async () => {
  app.listen(PORT, () => console.log(`server is running on PORT:${PORT}`));
};

start().catch((error) => {
  console.log("Error while starting the server", error);
});
