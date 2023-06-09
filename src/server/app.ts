import express from "express";
import api from "./api.server";
import routing from "./routing";
import webhooks from "./webhooks";

const app = express();

app.use("/api", api);
app.use("/", routing);
app.use(webhooks);

export default app;
