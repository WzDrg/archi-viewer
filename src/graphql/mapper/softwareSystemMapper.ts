import { Node, Network, containerId, softwareSystemId, LinkType } from "../../core/model/network";
import { Container, Reference, SoftwareSystem } from "../model/model";
import { ReferenceLink } from "../model/reference";
import { referenceLinkToLink } from "./referenceMapper";

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