//Required modules
const express = require('express');
const router = express.Router();

//Bring Models module
const Article = require('../models/article.js');
const User = require('../models/user.js');
const userAuth = require('./strategy/authentificate.js')


//ADD article rooute 
router.get('/add', userAuth, async (req, res) => {
    res.render('./articles/add_article.pug', {
        title: 'Add Article'
    });
});

//receive new articles
router.post('/add', userAuth, async (req, res) => {
    var article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;
    article.image = req.body.image || null;
    if (article.title && article.author && article.body) {
        try {
            await article.save().then(() => {
                res.send('Success');
            });
        } catch(err) {
            res.send('Error')
        }
    } else {
        res.send('Error')
    }
}); 

//Get edit article route
router.get('/edit/:id', userAuth, async (req, res) => {
    await Article.findById(req.params.id).then((article) => {
        if (article.author != req.user._id) {
            req.flash('danger', "You aren't loged in with the good account.");
            res.redirect('/users/login');
        }
        res.render('./articles/edit_article.pug', {
            title: 'Edit Article',
            article: article
        });
    });
});

//Upgrade the POST request 
router.post('/edit/:id', userAuth, async (req, res) => {
    await Article.findById(req.params.id).then( async (authArticle) => {  
        var errorLevel = false; 
        var article = {};
        article.title = req.body.title;
        article.body = req.body.body;
        if (authArticle.author != req.user._id) {
            req.flash('danger', "You aren't loged in with the good account.");
            res.redirect('/users/login');
            return;
        }
        if (!article.title || !article.body){
            req.flash('danger', "All fields must be filled to proceed");
            res.redirect('/articles/edit/' + req.params.id);
            return;
        }

        await Article.updateOne({ _id: req.params.id }, article).catch((err) => {
            errorLevel = true;
        }).then(() => {
            if (!errorLevel) {
                req.flash('success', 'Article edited successfully.');
                res.redirect('/articles/');
            } else {
                req.flash('danger', "Article couldn't be edited.");
                res.redirect('/articles/edit/' + req.params.id);
            }
        });
    });
});

//delete article
router.delete('/:id', async (req, res) => {
    try {
        if (!req.user._id) {
            res.status(500).send();
        }
        let query = { _id: req.params.id };
        const article = await Article.findById(req.params.id);
    
        if (article.author != req.user._id) {
          res.status(500).send();
        } else {
          remove = await Article.findByIdAndRemove(query);
          if (remove) {
            res.send('Success');
          }
        };
      } catch (e) {
        res.send(e);
      }
});

//Get Single Article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id).catch((err) => {
        if (err) {
            console.log(err)
            req.flash('danger', 'Article not found.');
            res.redirect('/articles/');
        }
    }).then((article) => {
        if (article) {
        User.findById(article.author).then((user) => {
            res.render('./articles/article.pug', {
                title: 'Article',
                article: article,
                author: user.username
            });
        });
        } else {
            req.flash('danger', 'Article not found.');
            res.redirect('/articles/');
        }
    });
});

router.get('/', (req, res) => {
    Article.find().then((articles, err) => {
        if(err){
            req.flash('danger', 'Articles not found')
            res.redirect('/articles/')
        } else {
            res.render('./articles/articles.pug', {
                title: 'Articles',
                articles: articles
            }); 
        }
    });
});

module.exports = router;