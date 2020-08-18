import ApolloClient, { gql } from "apollo-boost";
import { Network, Node, environmentId, serverId, Link, LinkType } from "../core/Network";
import { ReferenceLink, referenceLinkToLink } from "./Reference";

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

const serverToNodes = (server: Server): Node[] =>
    [{
        color: "black",
        id: serverId(server.name),
        name: server.name
    }];

const serverToLinks = (environment: string) =>
    (server: Server): ReferenceLink[] =>
        [{
            color: "black",
            source: environmentId(environment),
            target: serverId(server.name),
            type: LinkType.CONTAINS
        }];

// Convert the environments to a nodes
const environmentToNodes = (environment: Environment): Node[] =>
    [
        {
            color: "orange",
            id: environmentId(environment.name),
            name: environment.name
        },
        ...environment.servers.map(serverToNodes).flat()];

const environmentToLinks = (nodes: Node[]) =>
    (environment: Environment): Link[] =>
        [...environment
            .servers
            .map(serverToLinks(environment.name))
            .flat().map(referenceLinkToLink(nodes))];

export const environmentsToNetwork = (environments: Environment[]): Network => {
    const nodes = environments.map(environmentToNodes).flat();
    return {
        nodes: nodes,
        links: environments.map(environmentToLinks(nodes)).flat()
    }
};

export const getEnvironments = (client: ApolloClient<any>) =>
    async (): Promise<Network> => {
        const result = await client.query({ query: GET_ENVIRONMENTS });
        return environmentsToNetwork(result.data.environments);
    }