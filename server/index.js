

const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4"); // Use express4 middleware explicitly
const bodyParser = require("body-parser");
const cors = require("cors");

const {default:axios} = require("axios");
const typeDefs = `
type User {
  id: ID!
  name: String!
  username: String!
  email: String!
  phone: String!
}

type Todo {
  id: ID!
  title: String!
  completed: Boolean
  user: User
}

type Query {
  getTodos: [Todo]
  getAllUsers: [User]
  getUser(id: ID!): User
}
`;


const resolvers = {
  Todo:{
    user:async(todo)=>
      (
        (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
      )
      
  },
  Query: {
    getTodos: async() => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
    getAllUsers:async() => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
    getUser:async(parent ,{id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
  },
};

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Use express4 middleware for @apollo/server integration
  app.use(
    "/graphql",
    cors(), // Enable CORS
    bodyParser.json(), // Parse JSON request bodies
    expressMiddleware(server)
  );

  app.listen(8000, () => {
    console.log("Server started at http://localhost:8000/graphql");
  });
}

startServer();


//  yarn create react-app .

// this above command is used to create the react app