const express = require('express');
const mongoose = require('mongoose');
var app = express();
const user = require('./routes/membersystem');
const bodyParser = require('body-parser');
const Article = require('./models/articles');
const methodOverride = require('method-override')
var cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('_method'))
app.set('views' , __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'))


app.get('/' , async (req,res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/consumerview.ejs', { articles: articles })
})






mongoose.connect("mongodb://localhost:27017/bbtogc?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false" , {useNewUrlParser: true , useUnifiedTopology : true , useCreateIndex: true})
.then(console.log("connected to database"))
.catch((err) => console.error(err));

app.use('/' , user);
app.listen(5000);







