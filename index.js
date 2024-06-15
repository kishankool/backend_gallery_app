const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const mediaRoutes = require("./routes/media");

require("dotenv").config();



app.use(cors());
app.use(express.json());

app.use("/api/media", mediaRoutes);


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

  const server = app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
  );
  