import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "../../graphl/schema";
import { resolvers } from "../../graphl/resolvers";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "micro-cors";

const cors = Cors();
const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

export default cors(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};