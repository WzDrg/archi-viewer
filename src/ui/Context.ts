import { InMemoryCache, ApolloClient } from '@apollo/client';
import React from 'react';
import { CoreServices, coreServices } from '../core/coreServices';
import { graphqlNetworkServices } from '../graphql/graphQLServices';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000/graphql"
});
export const defaultCoreServices = coreServices(graphqlNetworkServices(client));
export const CoreServicesContext = React.createContext<CoreServices>(defaultCoreServices);

