const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exhb = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

const connectDB = require('./config/db')

// Load config
dotenv.config({path:'./config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express();

// Logging
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

// Handlebars
app.engine('.hbs', exhb({defaultLayout:'main', extname:'.hbs'}))
app.set('view engine','.hbs')

// sessions
app.use(session({
  secret:'alfjaldfjlakfjdflkdjfjdflkaldajs',
  resave:false,
  saveUninitialized:false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname,'public')))

// Route
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`))