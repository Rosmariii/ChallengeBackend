import express from 'express'

import bodyParser from 'body-parser'

import "reflect-metadata" 

import { json } from 'body-parser'

import indexRouts from "./routes/index"
const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(indexRouts)


app.get('/', function(req: any, res: any){})

app.listen(process.env.PORT)

