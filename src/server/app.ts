import express from "express";
import api from "./api";
import routing from "./routing";

const app = express();

app.use("/api", api);
app.use("/", routing);

export default app;
