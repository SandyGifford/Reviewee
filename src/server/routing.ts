import express from "express";
import { DIST_DIR } from "./consts";

const routing = express();

routing.use(express.static(DIST_DIR));

export default routing;
