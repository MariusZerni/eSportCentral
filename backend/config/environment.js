const port = process.env.PORT || 8000
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/events-db'

const secret = 'thisSecretIsSuperTrashButItWillBeOkForNow'

module.exports = {
  port,
  dbURI,
  secret
}
