import ApolloClient, { gql } from "apollo-boost";
import { Network, Node, serverId, Link, LinkType, containerId, containerInstanceId } from "../../core/model/network";
import { Container, ContainerInstance, Environment, Server } from "../model/model";
import { ReferenceLink } from "../model/reference";
import { referenceLinkToLink } from "./referenceMapper";

const containerToNodes = (container?: Container): Node[] =>
    container
        ? [{
            color: "blue",
            id: containerId(container.name),
            name: container.name
        }] : [];

const containerToLinks = (containerInstance: ContainerInstance) =>
    (container?: Container): ReferenceLink[] =>
        container ? [{
            color: "black",
            source: containerInstanceId(containerInstance.name),
            target: containerId(container.name),
            type: LinkType.USES
        }] : [];

const containerInstancesToNodes = (containerInstance: ContainerInstance): Node[] =>
    [{
        color: "lightblue",
        id: containerInstanceId(containerInstance.name),
        name: containerInstance.name
    },
    ...containerToNodes(containerInstance.container)];

const containerInstancesToLinks = (server: Server) =>
    (containerInstance: ContainerInstance): ReferenceLink[] =>
        [{
            color: "black",
            source: serverId(server.name),
            target: containerInstanceId(containerInstance.name),
            type: LinkType.CONTAINS
        },
        ...containerToLinks(containerInstance)(containerInstance.container)];

const serverToNodes = (server: Server): Node[] =>
    [{
        color: "black",
        id: serverId(server.name),
        name: server.name
    },
    ...server.containers.map(containerInstancesToNodes).flat()];

const serverToLinks = (environment: string) =>
    (server: Server): ReferenceLink[] =>
        [...server.containers.map(containerInstancesToLinks(server)).flat()];

// Convert the environments to a nodes
const environmentToNodes = (environment: Environment): Node[] =>
    [
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

