/* eslint-disable no-unused-vars */
const express = require('express')
// import ApolloServer
const { ApolloServer } = require('apollo-server-express')

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection')
const { authMiddleware } = require('./utils/auth') 

const PORT = process.env.PORT || 3001
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start()

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app })
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  })
})

// Call the async function to start the server
startApolloServer(typeDefs, resolvers)
