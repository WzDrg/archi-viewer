import { Link, Node } from "../../core/model/network";
import { ReferenceLink } from "../model/reference";

export const referenceLinkToLink = (nodes: Node[]) =>
    (nameLink: ReferenceLink): Link =>
    ({
        color: nameLink.color,
        source: nodes.find(node => node.id === nameLink.source),
        target: nodes.find(node => node.id === nameLink.target),
        type: nameLink.type
    });