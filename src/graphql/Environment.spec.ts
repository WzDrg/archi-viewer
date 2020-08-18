import { Environment, environmentsToNetwork } from "./Environment";

describe("environmentToNetwork", () => {
    it("should convert a single software system", () => {
        const environments: Environment[] = [{
            name: "TST",
            servers: []
        }];
        const network = environmentsToNetwork(environments);
        expect(network.nodes).toHaveLength(1);
        expect(network.nodes[0]).toHaveProperty("id", "Environment: TST");
        expect(network.nodes[0]).toHaveProperty("name", "TST");
    });
});