import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers, ResolversEnhanceMap, applyResolversEnhanceMap } from '@generated/type-graphql';
import cors from 'cors';

import express from 'express';
import http from 'http';
import path from 'node:path';
import * as tq from 'type-graphql';
import { Container, Service } from 'typedi';
import prisma from './prisma-client';
import { MyContext } from './context.interface';

import { config } from 'dotenv';
import { useContainer, useExpressServer } from 'routing-controllers';
// import { CustomAuthChecker } from './common/customAuthChecker';

// import { Authorized } from 'type-graphql';

import { HasAbility, MyCustomAuthChecker, customAuthChecker } from './common/customAuthChecker';

config({
  path: '.env',
  debug: true,
  override: true, // I need to turn this oof for production
});

const bootstrap = async () => {
  // NOTE: typedi Container requires this for the Resolvers.
  resolvers.forEach((value, index, array) =>
    array.forEach((v) => {
      Service()(v);
    }),
  );

  const app = express();
  useContainer(Container); // Required for routing-controllers to use typedi.
  // Configure routing-controllers.
  useExpressServer(app, {
    routePrefix: '/api',
    controllers: [path.join(__dirname + '/api/controllers/**/*.controller.ts')],
  });

  const httpServer = http.createServer(app);

  const resolversEnhanceMap: ResolversEnhanceMap = {
    Post: {
      post: [tq.Authorized<{ action: string; subject: string }>({ action: 'myaction', subject: 'mysubject' }), HasAbility([{ action: 'myaction', subject: 'mysubject' }])],
    },
  };

  applyResolversEnhanceMap(resolversEnhanceMap);

  const schema = await tq.buildSchema({
    validate: false, // Enable 'class-validator' integration..
    resolvers,
    // Register 3rd party IOC container
    container: Container,
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, 'schema.graphql'),
    //authChecker: customAuthChecker,
    authChecker: MyCustomAuthChecker,
  });

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start().then(() => {
    console.log('Apollo server started');
  });

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server as ApolloServer<MyContext>, {
      context: async ({ req }) => ({
        req,
        token: req.headers?.token as string | undefined,
        prisma,
      }),
    }),
  );

  const port = process.env.PORT || 4000;

  // Modified server startup
  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/`);
};

bootstrap().catch((err) => {
  console.error(err);
  //process.exit(1);
});
function Authorize(): MethodDecorator {
  throw new Error('Function not implemented.');
}
