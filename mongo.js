const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://alieser:${password}@cluster-fso.gpuq4ya.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person. number)
    })
    mongoose.connection.close()
  })
} else {
  const nameToAdd = process.argv[3]
  const numberToAdd = process.argv[4]

  const person = new Person({
    name: nameToAdd,
    number: numberToAdd
  })

  person.save().then(result => {
    console.log(`added ${nameToAdd} number ${numberToAdd} to phonebook`)
    mongoose.connection.close()
  })
}
