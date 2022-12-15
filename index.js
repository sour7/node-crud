const express = require("express");
const mongoose = require("mongoose");
const Comments = require("./comments.js");

const multer = require("multer");

const app = express();

const uploads = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      const preSuffix = Date.now() + "-" + Math.floor(Math.random() * 100);
      cb(null, preSuffix + file.fieldname + ".jpg");
    },
  }),
}).single("user_file");

mongoose.connect(
  "mongodb+srv://saurav:123@cluster0.4yvcf.mongodb.net/testcrud?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

app.use(express.json());

// <=========================POST/ CREATE mETHOD=====================================>
app.post("/create", async (req, res) => {
  const newComments = new Comments(req.body);
  try {
    const savedComments = await newComments.save();
    res.status(200).json(savedComments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// <=============================GET METHOD===========================================>
app.get("/", async (req, res) => {
  try {
    // with pagination
    const limitValue = req.query.limit || 2;
    const skipValue = req.query.skip || 0;
    const posts = await Comments.find()
      .limit(limitValue)
      .skip(skipValue)
      .lean()
      .exec();
    res.status(200).send(posts);
    // without pagination===========>
    // const savedComments = await Comments.find();
    // res.status(200).json(savedComments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// <===================================DELETE===========================================>
app.delete("/list/:_id", async (req, res) => {
  try {
    const data = await Comments.deleteOne(req.params);
    res.status(200).send("this item is deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// <========================find by id when id is passed in parms========================>

app.get("/list/:_id", async (req, res) => {
  try {
    const data = await Comments.findById(req.params);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
// <================================update MED=THOD=======================================>
app.put("/update/:_id", async (req, res) => {
  try {
    const data = await Comments.updateOne(req.params, { $set: req.body });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// <====================SEARCH API WITH SINGLE/MULTIPLE FIELD=============================>

app.get("/search/:key", async (req, res) => {
  try {
    const data = await Comments.find({
      $or: [
        { name: { $regex: req.params.key } },
        { text: { $regex: req.params.key } },
      ],
    });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// <==================File UPload using MUlter===========================>
app.post("/upload", uploads, async (req, res) => {
  try {
    res.status(200).send("uploaded");
  } catch (err) {
    res.status(500).json(err);
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log("app is listening on port no. : " + PORT);
});
