const express = require("express");
const app = express();
const path = require('path');
const ejsLayouts = require("express-ejs-layouts");

app.use(express.urlencoded({ extended: true }));

const router = express.Router();
const PORT = process.env.PORT || 3000;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//configuration
// Set up express-ejs-layouts
app.use(ejsLayouts);
app.use(router);
app.set('layout', 'layout');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const tasks = [];

// Routes
router.get('/', (req, res) => {
    res.render('pages/index', { tasks });
});

router.post('/add', (req, res) => {
    const { task } = req.body;
    if (task) {
        tasks.push({text: task, done: false});
    }
    res.redirect('/');
});

router.post('/update', (req, res) => {
    const { id, dome } = req.query;
    tasks[id].done = done;
    res.redirect('/');
});

router.post('/delete/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1); // Remove task from array
    } 
    res.redirect('/');
});

router.post('/toggle/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < tasks.length) {
        tasks[index].done = !tasks[index].done;
    } 
    res.redirect('/');
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
