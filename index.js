const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())

// dont forget this to handle json POST requests!!
app.use(express.json())

// define new token
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    //console.log('Body2:  ', request['body'])
    console.log('---')
    next()
  }
app.use(requestLogger)

let data  = [
{ 
  "id": 1,
  "name": "Arto Hellas", 
  "number": "040-123456"
},
{ 
  "id": 2,
  "name": "Ada Lovelace", 
  "number": "39-44-5323523"
},
{ 
  "id": 3,
  "name": "Dan Abramov", 
  "number": "12-43-234345"
},
{ 
  "id": 4,
  "name": "Mary Poppendieck", 
  "number": "39-23-6423122"
}
]

app.get('/',(request,response) => {
    response.send('<h1>This is the Homepage!<h1>')
})

app.get('/api/persons', (request,response) => {
    response.json(data)
})

app.get("/info", (request,response) => {
    const length = data.length
    const date = new Date().toString()
    console.log(date)
    response.send(`<h1>phonebook has info for ${length} people</h1><br><h1>${date}</h1>`)
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id,typeof(id))
  const person = data.find(person => person.id === id)
  console.log(person.name)
  //console.log(person["name"])
  if(person){
    response.json(person)
  }
  else{
    response.status(404).end
  }
  
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    console.log(id)
    data = data.filter(person => person.id !== id)
    
    console.log(data)
    response.status(204).end()
})

const getRandomInt = (max)  => Math.floor(Math.random() * max)

app.post('/api/persons', (request, response) => {
    const body = request.body
    const unique = data.find(person => person.name === body.name)
    //console.log(body)
    if (!body.name ){
        return response.status(400).json(
            {error:'no name  entered'}
            )
    }
    if (!body.number){
        return response.status(400).json({
            error:"no number entered"
        })
    }
    if (unique) {
        return response.status(400).json({
            error: "name already exists"
        })
    }

    id = getRandomInt(10000)
    name = body.name
    number = body.number
    person = {
        name: name,
        number: number,
        id: id
    }
    data = data.concat(person)
    response.json(data)
})
// this will only be called if there is no matching route...thats why it is at the bottom

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)
  


const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`server running on ${PORT}`)
})
