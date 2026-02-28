import { Application } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./resolvers/index";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.get("/health", (req, res) => {
        res.json({ status: "ok", service: "tracebit-backend" });
    });

    app.listen(PORT, () => {
        console.log(`🚀 TraceBit Backend REST running at http://localhost:${PORT}`);
        console.log(`🚀 TraceBit GraphQL API running at http://localhost:${PORT}/graphql`);
    });
};

startServer();
