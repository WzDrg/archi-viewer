import { LinkType } from "../../core/model/network";

export interface ReferenceLink {
    color: string;
    source: string;
    target: string;
    type: LinkType;
}
