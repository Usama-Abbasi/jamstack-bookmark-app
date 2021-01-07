const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const query = faunadb.query;

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark]
  }
  type Mutation {
    addBookmark(name: String, url: String,description:String): Bookmark
    deleteBookmark(id: String): Bookmark
  }
  type Bookmark {
    id: String
    name: String
    url: String
    description:String
  }
`;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

const resolvers = {
  Query: {
    bookmarks: async () => {
      // console.log("inside bookmarks");
      var result = await client.query(
        query.Map(
          query.Paginate(query.Documents(query.Collection("bookmark"))),
          query.Lambda((x) => query.Get(x))
        )
      );
      console.log(result)
      const bookmarks = result.data.map((bookmark) => ({
        id: bookmark.ref.id,
        name: bookmark.data.name,
        url: bookmark.data.url,
        description: bookmark.data.description,
      }));
      console.log(bookmarks);
      return bookmarks;
    },
  },
  Mutation: {
    addBookmark: async (_, { name, url,description }) => {
      // console.log("Inside Bookmarkd")
      const item = {
        data: { name: name, url: url,description:description, },
      };
      // console.log(item);
      try {
        const result = await client.query(
          query.Create(query.Collection("bookmark"), item)
        );
        console.log("result", result);

        return {
          name: result.data.name,
          url: result.data.url,
          id: result.ref.id,
          description: result.data.description,
        };
      } catch (error) {
        console.log("Error", error);
        return {
          name: "error",
          url: "null",
          description: "error",
          id: "-1",
        };
      }
    },

    deleteBookmark: async (_, { id }) => {
      try {
        const result = await client.query(
          query.Delete(query.Ref(query.Collection("bookmark"), id))
        );
        console.log("result", result);

        return {
          name: result.data.name,
          url: result.data.url,
          description: result.data.description,
          id: result.ref.id,
        };
      } catch (error) {
        console.log("Error", error);
        return {
          name: "error",
          url: "null",
          description: "Error",
          id: "-1",
        };
      }
    },

  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler();
