require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
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

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body

    // const doesExist = Person.find({ name: newPerson.name })
    // if (doesExist) {
    //     response.status(400).send({
    //             error: "name must be unique"
    //     })
    // }

    if (!newPerson.name || !newPerson.number) {
        response.status(400).send({
            error: "name and number fields must not be empty"
        })
    } else {
        const person = new Person({
            name: newPerson.name,
            number: newPerson.number
        })
    
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})

app.get('/info', (request, response) => {
    const currentTime = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${currentTime}</p>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
