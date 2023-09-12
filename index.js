const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

let persons = [
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

app.get('/', (request, response) => {
    response.send('Hello World')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = parseInt(request.params.id)
    const entry = persons.find(person => person.id === id)
    if (entry) {
        response.json(entry)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    const randInt = (max) => Math.floor(Math.random() * max)
    morgan.token('body', request => JSON.stringify(request.body))
    const doesExist = persons.find(person => person.name === newPerson.name)
    if (doesExist) {
        response.status(400).send({
                error: "name must be unique"
        })
    }
    if (!newPerson.name || !newPerson.number) {
        response.status(400).send({
            error: "name and number fields must not be empty"
        })
    }
    newPerson.id = randInt(999999999999999)
    persons = persons.concat(newPerson)
    response.json(persons)
})

app.get('/info', (request, response) => {
    const currentTime = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${currentTime}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
