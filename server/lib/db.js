const fs = require("fs/promises");
const path = require("path");

/*
  In node, paths depend on when the node command
  was executed. To be able to use a relative path
  here to the file db.json in the same folder,
  we need to use the path module to resolve the
  correct path.
  __dirname is a global variable from node that
  contains the folder of the current module
  path.resolve will return the correct path for us
*/
const dbPath = path.resolve(__dirname, "./db.json");

/*
  Insert an article to the database
  param article: Object
  {
    title: string,
    body: string
  }

  For that reason, here we add:
  {
    id: string
    votes: Object {
      up: number,
      down: number
    },
    cretaedAt: string  //represents date
  }
  
  returns a Promise containing
  the new post if fullfilled
*/
function insert(article) {
  return fs.readFile(dbPath, "utf-8").then((jsonData) => {
    const articles = JSON.parse(jsonData);
    const newArticle = {
      ...article,
      id: `${articles.length + 1}`,
      createdAt: new Date().toISOString(),
      votes: {
        up: 0,
        down: 0,
      },
    };
    articles.push(newArticle);
    fs.writeFile(dbPath, JSON.stringify(articles));
    return newArticle;
  });
}

/*
  Find all the posts in the database

  returns an Promise containing an array of posts
  if fulfilled
*/
function findAll() {
  return fs.readFile(dbPath, "utf-8").then((jsonData) => {
    const articles = JSON.parse(jsonData);
    return articles;
  });
}

/*
  param id: string

  returns a Promise containing the found article
  if existing or undefined if no article with the
  given id exists if fullfilled
*/
function findById(id) {
  return fs.readFile(dbPath, "utf-8").then((jsonData) => {
    const articles = JSON.parse(jsonData);

    const article = articles.find((article) => {
      return article.id === id;
    });

    return article;
  });
}
/*
  param id: string
  param content: Object {
    title: string
    body: string,
  }

  returns a Promise containing the updated post
  if existing or undefined if no post with the
  given id exists if fullfilled
*/
function updateById(id, content) {
  return fs.readFile(dbPath, "utf-8").then((jsonData) => {
    const articles = JSON.parse(jsonData);

    let newArticle;
    const newArticles = articles.map((article) => {
      if (article.id === id) {
        newArticle = {
          ...article,
          ...content,
        };
        return newArticle;
      } else {
        return article;
      }
    });

    if (newArticle) {
      fs.writeFile(dbPath, JSON.stringify(newArticles));
    }

    return newArticle;
  });
}

/*
  param id: string

  returns a a void Promise (contains no data).
  If the Promise is fullfilled, then the operation
  was successful. If the Promise is rejected,
  operation failed.
*/
function deleteById(id) {
  return fs.readFile(dbPath, "utf-8").then((jsonData) => {
    const articles = JSON.parse(jsonData);

    const newArticles = articles.filter((article) => {
      return article.id !== id;
    });

    return fs.writeFile(dbPath, JSON.stringify(newArticles));
  });
}

/*
  This module exports the following functions
*/
exports.insert = insert;
exports.findAll = findAll;
exports.findById = findById;
exports.deleteById = deleteById;
exports.updateById = updateById;

/*
  Example Usage:
  const db = require('db');

  db.insert({ title: "A Title", body: "some content"})
    .then(newPost => {
      console.log(newPost);
    })
    .catch(error => {
      console.error(error);
    });
  
  db.findAll().then(posts => {
    console.log(posts);
  })

  db.findById("1").then(post => {
    if(post) {
      console.log("Post found")
    } else {
      console.log("Post not found")
    }
  });

  db.deleteById("1").then(() => {
    console.log('deleted successfully');
  })

  db.updateById("1", { body: "new content" }).then(updatedPost => {
    if (updatedPost) {
      // Post updated
    } else {
      // Post not found, hence couldn't be updated
    }
  });
*/
