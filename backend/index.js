import app from "./app.js";
import { PORT } from "./apiKeys.js"

app.listen(PORT);

console.log("server listening", PORT);

export default app;
