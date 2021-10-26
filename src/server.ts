import express from "express";
import cors from "cors";

import ws from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { graphqlHTTP } from "express-graphql";

import { schema } from "./graphql/schema";
import { roots } from "./graphql/schema";

const main = async () => {
  const app = express();
  app.use(cors());
  app.use(
    "/graphql",
    // Format take in this issue: https://github.com/graphql/express-graphql/issues/721
    async (req, res) => {
      console.log(req);
      return graphqlHTTP({
        schema,
        graphiql: { headerEditorEnabled: true },
        // context: await makeContext(req.headers.authorization),
      })(req, res);
    }
  );

  const server = app.listen(4000, () => {
    const wsServer = new ws.Server({
      server,
      path: "/graphql",
    });
    useServer(
      {
        schema,
        roots,
        // context: (ctx) => {
        //   console.log(`context ${ctx.extra.request.headers.authorization}`);
        // },
        // onConnect: (ctx) => {
        //   console.log(`connect ${ctx.connectionParams?.authorization}`);
        // },
        // context: async (ctx) =>
        //   console.log(`context ${JSON.stringify(ctx, null, 2)}`),
        // onNext: async (ctx) =>
        //   console.log(`next ${JSON.stringify(ctx, null, 2)}`),
        // onSubscribe: async (ctx) =>
        //   console.log(`subscribe ${JSON.stringify(ctx, null, 2)}`),
        // onOperation: async (ctx) =>
        //   console.log(`operation ${JSON.stringify(ctx, null, 2)}`),
        // onComplete: async (ctx) =>
        //   console.log(`complete ${JSON.stringify(ctx, null, 2)}`),
        //   await makeContext(ctx.extra.request.headers.authorization),
      },
      wsServer
    );
    // wsServer.on("connection", (ws: ws.Server) => {
    //   ws.on("message", (req: string) => {
    //     let reqJSON = JSON.parse(req);
    //     console.log(reqJSON.payload.authorization);
    //     // console.log(req);
    //   });
    // });
    console.log(`HTTP server is now running on http://localhost:4000/graphql`);
    console.log(`WS server is now running on ws://localhost:4000/graphql`);
  });
};

main()
  .then(() => console.log("Server started"))
  .catch((e) => console.error(e));
