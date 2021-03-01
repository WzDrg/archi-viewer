import { ApolloClient } from "@apollo/client/core"
import NetworkServices from "../core/proxy/networkServices";
import { GraphQLDateTime } from "graphql-iso-date";
import { pipe } from "fp-ts/pipeable";
import { map, TaskEither, right, left } from "fp-ts/TaskEither";
import { softwareSystemsToNetwork } from "./mapper/softwareSystemMapper";
import { getSoftwareSystemsGraphQL } from "./client";
import { ArchiViewerError } from "../core/error";
import { Network } from "../core/model/network";

// Network services implementation using the GraphQL API
//export const graphqlNetworkServices = (uri: string): NetworkServices => {
//    const client = new ApolloClient({
//        cache: new InMemoryCache(),
//        uri: uri,
//        resolvers: {
//            Date: GraphQLDateTime
//        }
//    });
//}

const getSoftwareSystems = (client: ApolloClient<any>) =>
    (timestamp: Date): TaskEither<ArchiViewerError, Network> =>
        pipe(
            getSoftwareSystemsGraphQL(client)(timestamp),
            map(softwareSystemsToNetwork)
        );

const getSoftwareSystemNames = (client: ApolloClient<any>) =>
    (timestamp: Date): TaskEither<ArchiViewerError, string[]> =>
        left(ArchiViewerError.NotImplemented);

const getEnvironments = (client: ApolloClient<any>) =>
    (timestamp: Date): TaskEither<ArchiViewerError, Network> =>
        left(ArchiViewerError.NotImplemented);

export const graphqlNetworkServices = (client: ApolloClient<any>): NetworkServices =>
    pipe(
        client,
        client => Object.assign(client, { resolvers: { Date: GraphQLDateTime } }),
        client => ({
            getSoftwareSystems: getSoftwareSystems(client),
            getSoftwareSystemNames: getSoftwareSystemNames(client),
            getEnvironments: getEnvironments(client)
        }))
    ;