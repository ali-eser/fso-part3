require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.get('/', (request, response) => {
  response.send('Hello World')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    // console.log(result)
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        console.log(person)
        response.json(person)
      } else {
        console.log(person)
        response.status(404).send('Person with given id not found')
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const newPerson = request.body
  console.log(newPerson.name)

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number
  })
  person.save()
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
  Person.findByIdAndUpdate(request.params.id, { number: request.body.number }, { runValidators: true })
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
})

app.get('/info', (request, response, next) => {
  const currentTime = new Date()
  Person.find({})
    .then(result => {
      response.send(`<p>Phonebook has info for ${result.length} people</p>
                    <p>${currentTime}</p>`)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
