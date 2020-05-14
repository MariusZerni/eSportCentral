#### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive

# 'The eSports Events App'

## Overview

In the context of being confined to staying indoors people are looking for ways to distract themselves. A safe way to entertain and not think about the context of the year 2020 is to play and find a way to gather with like minded individuals. eSports is the only way to find new live entertainment. People are interested in seeing celebrities and proffesional gamers in action. This app brings multiple endpoints on the same platform without any distractions, making it the simplest way to gather.

## Brief

* Work in a team, using **git to code collaboratively**.
* **Build a full-stack application** by making your own backend and your own front-end
* **Use an Express API** to serve your data from a Mongo database
* **Consume your API with a separate front-end** built with React
* **Be a complete product** which most likely means multiple relationships and CRUD functionality for at least a couple of models

## Technologies Used
- HTML6
- SCSS
- JavaScript (ES6)
- NPM (package management)
- Node.js
- Express (JS Framework)
- Mongo and Mongoose (Database and Database manipulation)
- Insomnia (testing APIs)
- React 
- Moment
- Git and GitHub
- Heroku
- Bulma and Bulma Calendar
- Google Fonts
- LucidChart - for creating wireframes of the project
- Trello for project management

## Structure
The project will be structured in:
- Building the API routes with express
- Modeling data for the API
- Communicating with Mongo through Mongoose
- Finalizing and testing the API
- Creating the frontend components using React
- Styling the components to create a user friendly and consolidated experience
- Deploying the app using Heroku

## Wireframe
![Image of wireframe](https://github.com/bababumBab/Project-3/blob/master/frontend/images/wireframe.jpeg)


## Approach
Create a functional backend that can store events, usernames and passwords. Connect the backend with an initially simplified frontend and build upon creating multiple React components that render new content by changing state on the main 'Hub" page.

We tried to work in an agile manner by getting small functionalities working as quick as possible to give us a quick overview of how the app should function and to be able to adjust to different challenges along the way. 

Our main aim was to create something that will make things easier for people to find in one place all the sources of eSports - from proffesional gaming leagues to streamers.


First step was to create a functional database and connect to it using Mongoose.
```js
mongoose.connect(
  'mongodb://localhost/events-db',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  // This tells us if we've successfully connected!
  err => {
    if (err) console.log(err)
    else console.log('Mongoose connected to events-db!')
  }
)
```
In the same time we started working on the the main front end page, using React componenets that handle the state for our app. We also started pulling initial data from one of our API's that we are using to populate various fields in the web app.
```js
class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      games: null
    }
  }

  fetchAllGames() {
    axios
      .get('https://open.faceit.com/data/v4/games?offset=0&limit=20', {
        headers: {
          Authorization: 'Bearer 9a6523cf-c46d-434c-b623-3daeefa1acdb'
        }
      })
      .then(res => {
        this.setState({ games: res.data.items })
      })
      .catch(error => console.error(error))
  }

  componentDidMount() {
    this.fetchAllGames()
  }

  render() {
    return (
      <div className="container-m">
        <NavBar />

        <section
          className="section-m"
          style={{ backgroundImage: `url(${image})` }}
        >
          <Nav />
          <div className="content-m">
            <div className="container-games-m">
              {this.state.games && this.state.games 
                  .filter(game => game.assets.featured_img_m !== '')
                  .slice(8, 11)
                  .map(game => {
                    if (game.assets.featured_img_m === '') {
                      return null
                    } 

                    return (
                      <div key={game.game_id} className="image-container-m">
                        <img
                          className="games-image-m"
                          src={game.assets.featured_img_m}
                          alt="Placeholder image"
                        />
                      </div>
                    )
                  })}
            </div>
          </div>

          <Footer />
        </section>
      </div>
    )
  }
}

export default Home
```

Creating schemas for our events and usernames was another stepping stone that we needed in in order to increase the functionality of the web app. 

Event Schema:
```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDescription: { type: String, required: true },
  platform: { type: String, required: false },
  location: { type: String, required: false },
  // comments: [{ body: String, date: Date }] <- as a stretch goal we marked the code in the schema
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('EventModel', schema)
```
User Schema:
```js
const mongoose = require('mongoose')
const mongooseHidden = require('mongoose-hidden')() //plugins need to be installed

const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, minLength: 6, unique: true },
  password: { type: String, required: true, hide: true }
})

schema.plugin(require('mongoose-unique-validator'))
schema.plugin(mongooseHidden)

schema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

schema.pre('validate', function checkPassword(next) {
  if (
    this.isModified('password') &&
    this._passwordConfirmation !== this.password
  ) {
    this.invalidate('passwordConfirmation', 'should match')
  }
  next()
})

schema.pre('save', function hashPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  }
  next()
})

schema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', schema)
```

Below is an example of the secrets that together with the token creates a stronger authentification (jwt).
```js
For the User Schema we had to use encryption for our passwords and to generate tokens. 

const secret = 'thisSecretIsSuperTrashButItWillBeOkForNow'

module.exports = {
  secret
}
```

The snippet of code finds the user token performing storing and authentication, connecting the front end with the backend of the program. 

```js
function setToken(token) {
  localStorage.setItem('token', token)
}

function isLoggedIn() {
  const isLoggedIn = !!localStorage.getItem('token')
  console.log('logged' + isLoggedIn)
  return isLoggedIn
}

function logout() {
  localStorage.removeItem('token')
}

function getToken() {
  return localStorage.getItem('token')
}
function getUserId() {
  const token = getToken()
  if (!token) return false
  const parts = token.split('.')
  return JSON.parse(atob(parts[1])).sub
}

export default {
  setToken,
  isLoggedIn,
  logout,
  getToken,
  getUserId
}
```

We are connecting the secrets with the token creating a secure route. 
```js
const User = require('../models/user')
const { secret } = require('../config/environment')
const jwt = require('jsonwebtoken')

function secureRoute(req, res, next) {
  const authToken = req.headers.authorization
  if (!authToken || !authToken.startsWith('Bearer')) {
    return res.status(401).send({ message: 'Unauthorized, invalid LogIn ' })
  }
  const token = authToken.replace('Bearer ', '')
  jwt.verify(token, secret, (err, payload) => {
    if (err) return res.status(402).send({ message: 'Login expired' })

    User.findById(payload.sub)
      .then(user => {
        if (!user) return res.status(403).send({ message: 'No user was Found' })
        req.currentUser = user
        next()
      })
      .catch(() =>
        res
          .status(404)
          .send({
            message: 'Unauthorized, Middleware did not go through, error 401'
          })
      )
  })
}

module.exports = secureRoute
```

Building a robust and an appealing frontend was from the start one of the main goals we agreed as a team. We decided by splitting the components and parts that every one of us will do will avoid creating conflicts when merging at the end of the day into Github for safe storing all of our code.



## Challenges

- Biggest challenge was to work on the most complex component of the project - Hub Page. We assigned different features amongst the team. Putting together all of our code was the more interesting and rewarding challenge, but a challenge not to be repeated.
- Manipulating the limited data received from the FACEIT API in order to create some valuable content for our app.
- Finding another suitable API to work alongside the FACEIT API. 



## Victories 
- Creating working authentification for users, storing in the backend database created on Mondodb.
- Making a unified design across all pages, following the general theme of a gaming environment. 
- Being able to render different states on the Hub page without changing actually the page.
- Developing the ability to work together as a team in a very short time.
- Deployed the project succesfully on Heroku and learned on how to manage the app via Heroku.

## Potential future features

- Mobile friendly
- Ability to create private groups between friends

## Lessons learned
- Split from the beginning the components to avoid conflicts when merging to the code base onto Github.
- Focus on the functionality first and after on the design part. Working project trumps good looking project.