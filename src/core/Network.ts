export interface Node {
    id: string;
    color: string;
    name: string;
}

export const containerId = (name: string) =>
    "Container: " + name;

export const isContainer = (node: Node) =>
    node.id.startsWith("Container: ");

export const softwareSystemId = (name: string) =>
    "SoftwareSystem: " + name;

export const isSoftwareSystem = (node: Node) =>
    node.id.startsWith("SoftwareSystem: ");

export const environmentId = (name: string) =>
    "Environment: " + name;

export const isEnvironment = (node: Node) =>
    node.id.startsWith("Environment: ");

export const serverId = (name: string) =>
    "Server: " + name;

export enum LinkType {
    CONTAINS,
    USES
}

export interface Link {
    color: string;
    source: Node;
    target: Node;
    type: LinkType;
}

export interface Network {
    nodes: Node[];
    links: Link[];
}


export const removeNodeFromNetwork = (nodeToRemove: Node) =>
    (network: Network) =>
        ({
            nodes: network.nodes.filter(node => node.id !== nodeToRemove.id),
            links: network.links.filter(link => link.source.id !== nodeToRemove.id && link.target.id !== nodeToRemove.id)
        });

// Return true if the node is part of a given software system
export const ofSoftwareSystem = (network: Network, id: string) =>
    (node: Node) =>
        node.id === id || network.links.some(link => (link.source.id === id) && (link.target.id === node.id) && (link.type == LinkType.CONTAINS));


// Create a new link by replaceing the from node by the to node
const replaceNodeWithinLink = (from: Node, to: Node) =>
    (link: Link) =>
        link.source.id === from.id
            ? { ...link, source: to }
            : link.target.id === from.id
                ? { ...link, target: to }
                : link;

// Replace the node in the links
export const replaceNodeWithinLinks = (from: Node, to: Node) =>
    (links: Link[]): Link[] =>
        links.reduce((result, link) => [...result, replaceNodeWithinLink(from, to)(link)], []);

// Collapse a node onto another node
export const collapseNodeOnto = (from: Node, to: Node) =>
    (network: Network) =>
        ({
            nodes: network.nodes.filter(node => node.id !== from.id),
            links: replaceNodeWithinLinks(from, to)(network.links)
                .filter(link => link.source.id !== link.target.id)
        });

// Find the parent node of a given node in a network
const parentOf = (network: Network) =>
    (node: Node) =>
        network.links
            .find(link => link.target.id === node.id && link.type === LinkType.CONTAINS)
            .source;

// Remove a node from the network by replacing it by its parent node
export const collapseNodeOntoParent = (from: Node) =>
    (network: Network) =>
        collapseNodeOnto(from, parentOf(network)(from))(network);