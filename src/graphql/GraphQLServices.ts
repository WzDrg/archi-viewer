import ApolloClient, { InMemoryCache } from "apollo-boost";

import NetworkServices from "../core/NetworkServices";
import { getSoftwareSystemsGraphql, getSoftwareSystemNamesGraphql } from "./SoftwareSystem";
import { getEnvironments } from "./Environment";
import {GraphQLDateTime } from "graphql-iso-date";

// Network services implementation using the GraphQL API
export const graphqlNetworkServices = (uri: string): NetworkServices => {
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        uri: uri,
        resolvers: {
            Date: GraphQLDateTime
        }
    });
    return {
        getSoftwareSystems: getSoftwareSystemsGraphql(client),
        getSoftwareSystemNames: getSoftwareSystemNamesGraphql(client),
        getEnvironments: getEnvironments(client)
    };
}
