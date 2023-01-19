const app = require("express")();
const helmet = require("helmet");
const { json, urlencoded } = require("express");
const dbConnection = require("./config/dbConnection");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/globalErrorHandler");
const cors = require("cors");
const corsOptions = require("./helper/corsOptions");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

//Set security HTTP headers
app.use(helmet());


//Limit Requst from same API

const allowList = ["::1"]
const ApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req,res) => {
        console.log("api url:", req.url)
        if(req.url === '/login' || req.url === '/register') return 3
        else 100
    },
    message: 'Too many request from this IP, please try agin in 15 minute!',
    skip: (req,res) => allowList.includes(req.ip),
    standardHeaders: true,
    legacyHeaders: false
})
app.use('/api',ApiLimiter )

// Body parser, reading data from body into req.body
app.use(json());
app.use(urlencoded({ limit: "1mb", extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(cors(corsOptions));

app.use(require("./routes/authRoute"));

app.all("*", (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} in this server`));
});

app.use(globalErrorHandler);



module.exports = app;