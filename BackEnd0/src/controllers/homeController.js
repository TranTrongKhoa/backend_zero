const getHomePage = (req, res) => {
    res.send('Home page');
}

const getABC = (req, res) => {
    res.send('ABC page');
}

const getHoidanIT = (req, res) => {
    res.render('sample');
}

module.exports = {
    getHomePage, getABC, getHoidanIT
}