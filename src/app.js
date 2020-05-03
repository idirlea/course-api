const express = require("express");
const cors = require("cors");
const config = require("dotenv").config();

require('./db/db')

// routers
const mainRouter = require("./routers/home");
const userRouter = require("./routers/user");
const courseRouter = require("./routers/course");
const videoRouter = require("./routers/video");
const imageRouter = require("./routers/image");
const categoryRouter = require('./routers/category');
const pageRouter = require('./routers/page');
const viewRouter = require('./routers/view')
const subscribeRouter = require('./routers/subscriber')

const app = express();
app.use(express.json());
app.use(cors());

// set routes
app.use(mainRouter);
app.use(userRouter);
app.use(courseRouter);
app.use(videoRouter);
app.use(imageRouter);
app.use(categoryRouter);
app.use(pageRouter);
app.use(viewRouter);
app.use(subscribeRouter);

app.listen(config.parsed.PORT, () => {
  console.log(`Server running on port ${config.parsed.PORT}`);
});
