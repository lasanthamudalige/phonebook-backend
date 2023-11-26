const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

// get the sent data as a json assign it to a variable called 'body'
morgan.token('body', (request, response,) => {
    return JSON.stringify(request.body)
})

// log it in a custom format using morgan
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
))

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
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date
    response.send(
        `<div>
        <p>Phone book has info for ${persons.length} people</p>
        <p>${date}</p>
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        const updatePersonsList = persons.filter(person => person.id !== id)
        persons = updatePersonsList
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    const id = String(Math.round(Math.random() * 100000))

    // if the generated id is on the persons array run the function again
    if (persons.find(person => person.id === id)) {
        return generateId()
    }

    return id
}

app.post('/api/persons', (request, response) => {
    // get the json data from the request
    const body = request.body
    console.log();
    // if the name or the number is empty return 404 status code with the error
    if (!body.name || !body.number) {
        return response.status(404).json({
            error: 'content missing'
        })
        // else if the name is in the contacts return 400 status code with the error 
    } else if (persons.find(person => person.name == body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    // create a person object
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    // assign persons array with the previous contacts + the new person
    persons = [...persons, person]
    response.status(204).end()
})

const PORT = process.env.PORT | 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})