import { LinkType, Link, Node } from "../core/Network";

export interface ReferenceLink {
    color: string;
    source: string;
    target: string;
    type: LinkType;
}

// Convert a link using a reference to a link between nodes
export const referenceLinkToLink = (nodes: Node[]) =>
    (nameLink: ReferenceLink): Link =>
        ({
            color: nameLink.color,
            source: nodes.find(node => node.id === nameLink.source),
            target: nodes.find(node => node.id === nameLink.target),
            type: nameLink.type
        })