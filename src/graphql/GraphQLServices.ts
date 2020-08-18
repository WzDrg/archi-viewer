import ApolloClient, { InMemoryCache } from "apollo-boost";

import NetworkServices from "../core/NetworkServices";
import { getSoftwareSystemsGraphql, getSoftwareSystemNamesGraphql } from "./SoftwareSystem";

// Network services implementation using the GraphQL API
export const graphqlNetworkServices = (uri: string): NetworkServices => {
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        uri: uri
    });
    return {
        getSoftwareSystems: getSoftwareSystemsGraphql(client),
        getSoftwareSystemNames: getSoftwareSystemNamesGraphql(client)
    };
}
