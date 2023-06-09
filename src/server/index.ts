import app from "./app";
import { PORT } from "./consts.server";

app.listen(PORT, () => console.log(`** LISTENING ON PORT ${PORT} **`));
