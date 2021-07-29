const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Article = require("./models/article");

/*
  We create an express app calling
  the express function.
*/

const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
  Application Level Middleware
*/

app.use(express.json());
app.use(cors());
app.use(function addRequestTime(req, res, next) {
  console.log("Request time:", Date.now());
  next();
});
app.use(function getUrl(req, res, next) {
  console.log("The url is:", req.path);
  next();
});
app.use(function getMethod(req, res, next) {
  console.log("Method used:", req.method);
  next();
});

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());

/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/articles": "read and create new articles",
    "/articles/:id": "read, update and delete an individual article",
  });
});

app.get("/articles", (req, res) => {
  Article.find()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(500);
      res.send(error);
    });
});

//middleware function to validate article content when created

function validateRequest(req, res, next) {
  if (!req.body.title) {
    res.status(400).json({
      error: "Request body must contain a title property",
    });
    return;
  }
  if (!req.body.body) {
    res.status(400).json({
      error: "Request body must contain a body property",
    });
    return;
  }

  next();
}
// I am connecting to the article model I created on models
app.post("/articles", validateRequest, (req, res) => {
  Article.create(req.body)
    .then((newArticle) => {
      res.status(201).send(newArticle);
    })
    .catch(() => {
      res.status(500);
      res.json({ error: "something went wrong" });
    });
  // console.log("Post to articles");
  // db.insert(req.body)
  //   .then((newPost) => {
  //     res.status(201).send(newPost);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     res.send(error);
  //   });
});

//This is a Route Level Middleware to validate is the Id is a number. I could have also used regex
function validateNumberId(req, res, next) {
  if (isNaN(req.params.id)) {
    res.status(400).json("Error: Id must be a number");
    return;
  }
  next();
}

app.get("/articles/:id", (req, res) => {
  console.log("GET by Id Works");
  Article.findById(req.params.id)
    .then((articleById) => {
      //first check for errors, then go on
      if (!articleById) {
        res.status(404).end();
        //we need to return here, otherwise it goes to the next line
        return;
      }
      res.status(200).send(articleById);
    })
    .catch((error) => {
      console.error(500);
      res.send(error);
    });
});

app.patch("/articles/:id", (req, res) => {
  console.log("PATCH works");
  const { id } = req.params;
  // const id = req.params.id;
  // const content = req.body; (i would put content instead of req.body)
  Article.findByIdAndUpdate(id, req.body, { new: true })
    .then((patchArticleById) => {
      if (!patchArticleById) {
        res.status(404).end();
        //we need to return here, otherwise it goes to the next line
        return;
      }
      res.status(200).send(patchArticleById);
    })
    .catch((error) => {
      console.error(500);
      res.send(error);
    });
});

app.delete("/articles/:id", (req, res) => {
  console.log("DELETE works");
  Article.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(500).end();
    });
});

app.get("/", (req, res) => {
  res.json({
    "/articles": "read and create new articles",
    "/articles/:id": "read, update and delete an individual article",
  });
});

/*
  We have to start the server. We make it listen on the port 4000

*/
mongoose
  .connect("mongodb://localhost:27017/articles-api", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Conneted to mongo");
    app.listen(4001, () => {
      console.log("Listening on http://localhost:4001");
    });
  });
