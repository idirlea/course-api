const express = require("express");
const cors = require("cors");
const config = require("dotenv").config();

// routers
const mainRouter = require("./routers/home");
const userRouter = require("./routers/user");
const courseRouter = require("./routers/course");
const videoRouter = require("./routers/video");
const imageRouter = require("./routers/image");


const app = express();
app.use(express.json());
app.use(cors());

// set routes
app.use(mainRouter);
app.use(userRouter);
app.use(courseRouter);
app.use(videoRouter);
app.use(imageRouter);

require('./db/db')

app.listen(config.parsed.PORT, () => {
  console.log(`Server running on port ${config.parsed.PORT}`);
});
