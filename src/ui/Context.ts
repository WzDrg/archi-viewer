import React from 'react';
import { CoreServices, coreServices } from '../core/CoreServices';
import { graphqlNetworkServices } from '../graphql/GraphQLServices';

export const defaultCoreServices = coreServices(graphqlNetworkServices("http://localhost:4000/graphql"));
export const CoreServicesContext = React.createContext<CoreServices>(defaultCoreServices);

