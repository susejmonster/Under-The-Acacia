const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
let token;


const user = 
    {
      username: 'Nandini',
      password: '1234'
    }


//set a header as the token, then check that header in every route.
router.get('/auth',(req, res) => {

    res.render('./login/landing');

})

router.post('/auth/signin', async (req, res) => {
    let alreadyusername = req.body.username;
    let alreadypassword  = req.body.password;
  
   
   if(alreadyusername === user.username && alreadypassword === user.password){   //create middleware for testing token everytime in protected routes
       //generate token here   
    const username = req.body.username;
    const user = {username: username}
    token = jwt.sign(user , '331217');
    console.log(token)
    
    res.redirect("/auth/dashboard");
   }
   else{
       res.redirect('/auth/authenticationerror');
       console.error("some error at auth login route")
   }
   
})



router.get('/auth/authenticationerror' , (req, res) => {
    res.send("there was a problem with authentication? re-enter your details or if you're lost,heres a direct link back to home")
})



router.get('/auth/signup' , (req, res) => {
    res.render('../views/login/signup.ejs');
})

router.post('/auth/signup', (req, res) => {
    res.render('../views/login/signup.ejs');
})

router.get('/articles/new' ,auth ,  (req, res) => {
    
    res.render('articles/form',{ article: new Article() });

})

router.post('/articles', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})

router.post('/update', async (req, res) => {
    const article= new Article({title: req.body.title , description: req.body.description , markdown: req.body.markdown});
    const result = await article.save();
    console.log(result);                            //put try catch block to print errors out ion case of duplicate artciles.
    res.redirect('/auth/dashboard')
})
  
    //article edit 
router.get('/auth/articles/edit/:id',auth, async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
  })

  router.put('/articles/:id' ,auth, async (req, res) => {
    const article = await Article.findById(req.params.id) 
    if(!article) {res.redirect('/auth/articles/edit/:id')}
    article.set({title: req.body.title , description: req.body.description , markdown: req.body.markdown});
    const result = await article.save();  
    console.log(result);    
    res.redirect('/auth/dashboard');
  })

  //article delete:
  router.delete('/articles/:id',auth, async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/auth/dashboard');
  })

//articles display
  router.get('/auth/dashboard' , auth ,async (req,res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })

}) 

router.get('/auth/articles/:slug',auth, async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })
  })

  router.get('/articles/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('articles/consumershow', { article: article })
  })




  function auth(req, res, next)
  {
      
      const authtoken = token;
      if (authtoken == null) return res.status(401).send("no token provided")
    
      jwt.verify(token, "331217", (err, user) => {
        console.log(err)
        if (err) return res.status(403).send("token could not be verified")
        req.user = user
        next()
      })
    }
      



module.exports  = router;