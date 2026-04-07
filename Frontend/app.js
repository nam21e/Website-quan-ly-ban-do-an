const express = require('express');
const path = require('path');

const app = express();

// static files
app.use(express.static(path.join(__dirname, 'public')));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// route
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});