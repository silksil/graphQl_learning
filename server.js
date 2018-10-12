const express = require('express');
const expressGraphQL = require('express-graphql');

/*
 * We have to specifically inform graphQl how data is arranged
 * This is done in the schema file
*/
const schema = require('./schema/schema');

const app = express();

// initialize graphQl
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));


app.listen(4000, () => {
  console.log('Listening on port 4000');
});
