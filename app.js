require('dotenv').config();

const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()

const route = require('./src/routes')

app.use(cookieParser())
app.use(express.json())

app.use('/api', route)

const port = process.env.PORT || 3000
const host = "localhost"
app.listen(port, host, ()=>{
    console.log(`Serveur démarré sur le port ${port} 🚀🚀🚀`);
})