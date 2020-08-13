import { Network, Node, ofSoftwareSystem, softwareSystemId, containerId, Link, LinkType } from "./Network";

describe("ofSoftwareSystem", () => {
    it("should match the software system", () => {
        const S1: Node = { id: softwareSystemId("S1"), name: "S1", color: "black" };
        const network: Network = { nodes: [S1], links: [] };
        expect(ofSoftwareSystem(network, softwareSystemId("S1"))(S1))
            .toBeTruthy();
    });

    it("should identify container from software system", () => {
        const S1: Node = { id: softwareSystemId("S1"), name: "S1", color: "black" };
        const C1: Node = { id: containerId("C1"), name: "C1", color: "black" };
        const L1: Link = { source: S1, target: C1, type: LinkType.CONTAINS, color: "black" };
        const network: Network = { nodes: [S1, C1], links: [L1] };
        expect(ofSoftwareSystem(network, softwareSystemId("S1"))(C1))
            .toBeTruthy();
    });

})