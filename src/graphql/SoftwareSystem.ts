import ApolloClient, { gql } from "apollo-boost";

import NetworkServices from "../core/NetworkServices";
import { Node, Link, Network, containerId, softwareSystemId, LinkType } from "../core/Network";

export interface Reference {
    type: string;
    name: string;
}

export interface Container {
    name: string;
    uses?: Reference[];
}
export interface SoftwareSystem {
    name: string;
    containers?: Container[];
    uses?: Reference[];
};

export interface ReferenceLink {
    color: string;
    source: string;
    target: string;
    type: LinkType;
}

const GET_SOFTWARE_SYSTEMS = gql`
    { 
        softwareSystems {
            name
            containers {
                name
                uses {
                    type
                    name
                }
            }
            uses {
                type
                name
            }
        }
    }
`;

const GET_SOFTWARE_SYSTEM_NAMES = gql`
    { 
        softwareSystems {
            name
        }
    }
`;

const containerToNodes = (container: Container): Node[] =>
    [{
        color: "blue",
        id: containerId(container.name),
        name: container.name
    }];

const referenceToName = (reference: Reference) => {
    switch (reference.type) {
        case "SOFTWARESYSTEM":
            return softwareSystemId(reference.name);
        case "CONTAINER":
            return containerId(reference.name);
    }
    return reference.name;
}

const referenceToLink = (source: string, linkType: LinkType) =>
    (reference: Reference) => ({
        color: "black",
        source: source,
        target: referenceToName(reference),
        type: linkType
    });

const softwareSystemToNodes = (softwareSystem: SoftwareSystem): Node[] =>
    [
        {
            color: "green",
            id: softwareSystemId(softwareSystem.name),
            name: softwareSystem.name
        },
        ...(softwareSystem.containers ?? [])
            .map(containerToNodes)
            .flat()];

// Convert a container to its corresponsing links
// - Uses relations to other items
const containerToLinks = (container: Container) =>
    (container.uses ?? [])
        .map(referenceToLink(containerId(container.name), LinkType.USES));

// Convert a single software system to all links defined within the software system.
// - Child link to container
// - Uses relation to other items
// - Links of child containers
const softwareSystemToLinks = (softwareSystem: SoftwareSystem): ReferenceLink[] =>
    [...(softwareSystem.containers ?? [])
        .map(container => ({
            color: "black",
            source: softwareSystemId(softwareSystem.name),
            target: containerId(container.name),
            type: LinkType.CONTAINS
        })),
    ...(softwareSystem.containers ?? []).map(containerToLinks).flat(),
    ...(softwareSystem.uses ?? [])
        .map(referenceToLink(softwareSystemId(softwareSystem.name), LinkType.USES))];

// Convert a link using a reference to a link between nodes
const referenceLinkToLink = (nodes: Node[]) =>
    (nameLink: ReferenceLink): Link =>
        ({
            color: nameLink.color,
            source: nodes.find(node => node.id === nameLink.source),
            target: nodes.find(node => node.id === nameLink.target),
            type: nameLink.type
        })

export const softwareSystemsToNetwork = (softwareSystems: SoftwareSystem[]): Network => {
    const nodes = softwareSystems
        .map(softwareSystemToNodes)
        .flat();
    return {
        nodes: nodes,
        links: softwareSystems
            .map(softwareSystemToLinks).flat()
            .map(referenceLinkToLink(nodes))
            .filter(link => link.source && link.target)
    }
};

export const getSoftwareSystemsGraphql = (client: ApolloClient<any>) =>
    async (): Promise<Network> => {
        const result = await client.query({ query: GET_SOFTWARE_SYSTEMS });
        return softwareSystemsToNetwork(result.data.softwareSystems);
    }

export const getSoftwareSystemNamesGraphql = (client: ApolloClient<any>) =>
    async (): Promise<string[]> => {
        const result = await client.query({ query: GET_SOFTWARE_SYSTEM_NAMES });
        return result.data.softwareSystems.map(softwareSystem => softwareSystem.name);
    }