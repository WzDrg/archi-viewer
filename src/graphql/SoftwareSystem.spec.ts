import { SoftwareSystem, softwareSystemsToNetwork } from "./SoftwareSystem"

describe("softwareSystemToNetwork", () => {
    it("should convert a single software system", () => {
        const softwareSystems: SoftwareSystem[] = [{
            name: "Document Capture",
            uses: []
        }];
        const network = softwareSystemsToNetwork(softwareSystems);
        expect(network.nodes).toHaveLength(1);
        expect(network.nodes[0]).toHaveProperty("id", "SoftwareSystem: Document Capture");
        expect(network.nodes[0]).toHaveProperty("name", "Document Capture");
    });

    it("should convert a single software system without uses", () => {
        const softwareSystems: SoftwareSystem[] = [{
            name: "Document Capture"
        }];
        const network = softwareSystemsToNetwork(softwareSystems);
        expect(network.nodes).toHaveLength(1);
        expect(network.nodes[0]).toHaveProperty("id", "SoftwareSystem: Document Capture");
        expect(network.nodes[0]).toHaveProperty("name", "Document Capture");
    });

    it("should convert a software system with container", () => {
        const softwareSystems: SoftwareSystem[] = [{
            name: "Document Capture",
            containers: [
                {
                    name: "KTA",
                    uses: []
                }
            ],
            uses: []
        }];
        const network = softwareSystemsToNetwork(softwareSystems);
        expect(network.nodes).toHaveLength(2);
        expect(network.nodes.filter(node => node.id === "SoftwareSystem: Document Capture")).toHaveLength(1);
        expect(network.nodes.filter(node => node.id === "Container: KTA")).toHaveLength(1);
    });

    it("should convert a software system with container without uses", () => {
        const softwareSystems: SoftwareSystem[] = [{
            name: "Document Capture",
            containers: [
                {
                    name: "KTA"
                }
            ],
            uses: []
        }];
        const network = softwareSystemsToNetwork(softwareSystems);
        expect(network.nodes).toHaveLength(2);
        expect(network.nodes.filter(node => node.id === "SoftwareSystem: Document Capture")).toHaveLength(1);
        expect(network.nodes.filter(node => node.id === "Container: KTA")).toHaveLength(1);
    });

    it("should convert a software system with multiple container", () => {
        const softwareSystems: SoftwareSystem[] = [{
            name: "Document Capture",
            containers: [
                { name: "KTA", uses: [] },
                { name: "KTA Designer", uses: [] }
            ],
            uses: []
        }];
        const network = softwareSystemsToNetwork(softwareSystems);
        expect(network.nodes).toHaveLength(3);
        expect(network.nodes.filter(node => node.id === "SoftwareSystem: Document Capture")).toHaveLength(1);
        expect(network.nodes.filter(node => node.id === "Container: KTA")).toHaveLength(1);
        expect(network.nodes.filter(node => node.id === "Container: KTA Designer")).toHaveLength(1);
    });

    it("should convert a single software system", () => {
        const softwareSystems: SoftwareSystem[] = [{
            name: "Document Capture",
            uses: []
        }];
        const network = softwareSystemsToNetwork(softwareSystems);
        expect(network.links).toHaveLength(0);
    });

    it("should convert a software system with container", () => {
        const softwareSystems: SoftwareSystem[] = [{
            name: "Document Capture",
            containers: [
                {
                    name: "KTA",
                    uses: []
                }
            ],
            uses: []
        }];
        const network = softwareSystemsToNetwork(softwareSystems);
        expect(network.links).toHaveLength(1);
    });

    it("should convert a software system with multiple container", () => {
        const softwareSystems: SoftwareSystem[] = [{
            name: "Document Capture",
            containers: [
                { name: "KTA" },
                { name: "KTA Designer" }
            ]
        }];
        const network = softwareSystemsToNetwork(softwareSystems);
        expect(network.links).toHaveLength(2);
        expect(network.links.filter(link => link.source.id === "SoftwareSystem: Document Capture" && link.target.id === "Container: KTA")).toHaveLength(1);
        expect(network.links.filter(link => link.source.id === "SoftwareSystem: Document Capture" && link.target.id === "Container: KTA Designer")).toHaveLength(1);
    });
});