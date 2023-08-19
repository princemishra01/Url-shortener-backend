const express = require("express");
const cors = require('cors')
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

require('dotenv').config();

const app = express();
app.use(cors());

const PORT = 8001;

connectToMongoDB(process.env.mongo_uri).then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());

app.get("/" , (req , res) => {
  res.send("test page");
})

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  // console.log(entry.redirectURL);
  tempUrl = entry.redirectURL;
  if(!(tempUrl.startsWith("http://") || tempUrl.startsWith("https://"))){
    tempUrl = "http://" + tempUrl;
  };
  res.redirect(tempUrl);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
