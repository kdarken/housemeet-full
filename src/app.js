const express = require('express')
const port = process.env.PORT
const userRouter = require('./routers/user')
var bodyParser = require('body-parser')
require('./db/db')

const app = express()

app.use(bodyParser.json());

app.use(express.json())
app.use(userRouter)

app.use(bodyParser.urlencoded({extended: false}));


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
