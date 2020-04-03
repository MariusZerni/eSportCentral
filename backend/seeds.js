const mongoose = require('mongoose')
const Event = require('./models/eventModel')
const User = require('./models/user')
const { dbURI } = require('./config/environment')
mongoose.connect(
  dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (error, db) => {
    if (error) {
      return console.log(error)
    }
    console.log('Successfully connected to mongo!')
    db.dropDatabase()
      .then(() => {
        return User.create([
          {
            username: 'HydrAKZR',
            email: 'hydra@gmail.com',
            password: 'joao1234',
            passwordConfirmation: 'joao1234'
          },
          {
            username: 'BabumbaBab',
            email: 'BabumbaBab@BabumbaBab.com',
            password: 'gabi1234',
            passwordConfirmation: 'gabi1234'
          },
          {
            username: 'Marius',
            email: 'marius1@yahoo.com',
            password: 'marius',
            passwordConfirmation: 'marius'
          }
        ])
      })
      .then(users => {
        return Event.create([
          {
            eventName: 'Best eF1 tournament',
            eventType: 'Remote',
            eventDescription: 'Race Simulator',
            platform: 'Steam',
            date: '2020-5-4',
            user: users[0]
          },
          {
            eventName: 'Best FIFA 2020',
            eventType: 'Remote',
            eventDescription: 'FIFA Simulator',
            platform: 'PC',
            date: '2020-6-19',
            user: users[0]
          },
          {
            eventName: 'Best FIFA 2019',
            eventType: 'Remote',
            eventDescription: 'FIFA Simulator',
            platform: 'xbox',
            date: '2020-12-09',
            user: users[1]
          },
          {
            eventName: 'LoL 2 Death Tournament',
            eventType: 'Remote',
            eventDescription: 'MOBA',
            platform: 'PC',
            date: '2021-01-01',
            user: users[0]
          }
        ])
      })
      .then(events => console.log(`${'🎮'.repeat(events.length)} created`))
      .then(() => console.log('Goodbye!'))
      .catch(err => console.log(err))
      .finally(() => mongoose.connection.close())
  }
)