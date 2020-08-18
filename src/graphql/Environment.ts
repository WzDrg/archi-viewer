import ApolloClient, { gql, InMemoryCache } from "apollo-boost";
import { Network, Node, environmentId } from "../core/Network";

export interface Server {
    name: string
}

export interface Environment {
    name: string,
    servers: Server[]
}

const GET_ENVIRONMENTS = gql`
    { 
        environments {
            name
            servers {
                name
            }
        }
    }
`;

const environmentToNodes = (environment: Environment): Node[] =>
    [
        {
            color: "green",
            id: environmentId(environment.name),
            name: environment.name
        }];

export const environmentsToNetwork = (environments: Environment[]): Network => {
    const nodes = environments
        .map(environmentToNodes)
        .flat();
    return {
        nodes: nodes,
        links: []
    }
};

export const getEnvironments = (client: ApolloClient<any>) =>
    async (): Promise<Network> => {
        const result = await client.query({ query: GET_ENVIRONMENTS });
        return environmentsToNetwork(result.data.environments);
    }