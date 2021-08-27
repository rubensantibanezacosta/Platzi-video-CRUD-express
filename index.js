const express = require("express");
const slash = require("express-slash");
const app = express();
const {config} = require("./config/index");
const moviesApi = require("./routes/movies");
const {logErrors, wrapErrors, errorHandler} = require("./utils/middleware/errorHandlers");
const notFoundHandler = require("./utils/middleware/notFoundHandler");

app.enable('strict routing');
//body parser
app.use(express.json());

//routes
moviesApi(app);
//routes finished at "/" optionally
app.use(slash());

//catch 404
app.use(notFoundHandler);

//Error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function(){
    console.log(`Listening http://localhost:${config.port}`);
});