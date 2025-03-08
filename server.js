const express = require('express')
const app = express()
const port = 4000 

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const cookie = require('cookie-parser')
app.use(cookie())




app.listen(port, () => console.log(`Example app listening on port ${port}!`))