import { filterShowSoftwareSystem, NetworkDisplayOptions, coreServices, isNodeVisible } from "../CoreServices";
import NetworkServices from "../NetworkServices";
import { LinkType } from "../Network";

describe("isNodeVisible", () => {
    it("should show or hide a container", () => {
        const S1 = { id: "SoftwareSystem: S1", name: "S1", color: "black" };
        const S2 = { id: "SoftwareSystem: S2", name: "S2", color: "black" };
        const C1 = { id: "Container: C1", name: "C1", color: "black" };
        const L1 = { source: S1, target: C1, type: LinkType.CONTAINS, color: "black" }
        const network = {
            nodes: [C1, S1, S2],
            links: [L1]
        };
        const options: NetworkDisplayOptions = {
            softwareSystem: null,
            level: "C2",
        };
        expect(isNodeVisible(network, options)(C1)).toBeTruthy();
        expect(isNodeVisible(network, { ...options, softwareSystem: "S1" })(C1)).toBeTruthy();
        expect(isNodeVisible(network, { ...options, softwareSystem: "S2" })(C1)).toBeFalsy();
    })
});

describe("filterShowSoftwareSystem", () => {
    it("should remove a single software system", () => {
        const network = {
            nodes: [{ id: "SoftwareSystem: Hello", name: "Hello", color: "blue" }],
            links: []
        };
        const result = filterShowSoftwareSystem(false)(network);
        expect(result.nodes).toHaveLength(0);
    });

    it("should show the software system", () => {
        const network = {
            nodes: [{ id: "SoftwareSystem: Hello", name: "Hello", color: "blue" }],
            links: []
        };
        const result = filterShowSoftwareSystem(true)(network);
        expect(result.nodes).toHaveLength(1);
    });

    it("should return no containers", async () => {
        const S1 = { id: "SoftwareSystem: S1", name: "S1", color: "black" };
        const C1 = { id: "Container: C1", name: "C1", color: "black" };
        const L1 = { source: S1, target: C1, type: LinkType.CONTAINS, color: "black" }
        const network = { nodes: [S1, C1], links: [L1] };
        const networkServices: NetworkServices = {
            getSoftwareSystemNames: () => Promise.resolve([]),
            getSoftwareSystems: () => Promise.resolve(network)
        }
        const services = coreServices(networkServices);
        const options: NetworkDisplayOptions = {
            level: "C1",
            date: null,
            environment: null,
            softwareSystem: null
        }
        const result = await services.getNetwork(options);
        expect(result.nodes).toHaveLength(1);
    });

    it("should return 2 software systems", async () => {
        const S1 = { id: "SoftwareSystem: S1", name: "S1", color: "black" };
        const S2 = { id: "SoftwareSystem: S2", name: "S2", color: "black" };
        const C1 = { id: "Container: C1", name: "C1", color: "black" };
        const L1 = { source: S1, target: C1, type: LinkType.CONTAINS, color: "black" }
        const network = { nodes: [S1, S2, C1], links: [L1] };
        const networkServices: NetworkServices = {
            getSoftwareSystemNames: () => Promise.resolve([]),
            getSoftwareSystems: () => Promise.resolve(network)
        }
        const services = coreServices(networkServices);
        const options: NetworkDisplayOptions = {
            level: "C1",
            date: null,
            environment: null,
            softwareSystem: null
        }
        const result = await services.getNetwork(options);
        expect(result.nodes).toHaveLength(2);
        expect(result.links).toHaveLength(0);
    });

    it("should return 2 software systems and remove a single link", async () => {
        const S1 = { id: "SoftwareSystem: S1", name: "S1", color: "black" };
        const S2 = { id: "SoftwareSystem: S2", name: "S2", color: "black" };
        const C1 = { id: "Container: C1", name: "C1", color: "black" };
        const L1 = { source: S1, target: C1, type: LinkType.CONTAINS, color: "black" }
        const L2 = { source: C1, target: S2, type: LinkType.USES, color: "black" }
        const network = { nodes: [S1, S2, C1], links: [L1, L2] };
        const networkServices: NetworkServices = {
            getSoftwareSystemNames: () => Promise.resolve([]),
            getSoftwareSystems: () => Promise.resolve(network)
        }
        const services = coreServices(networkServices);
        const options: NetworkDisplayOptions = {
            level: "C1",
            date: null,
            environment: null,
            softwareSystem: null
        }
        const result = await services.getNetwork(options);
        expect(result.nodes).toHaveLength(2);
        expect(result.links).toHaveLength(1);
    });

});