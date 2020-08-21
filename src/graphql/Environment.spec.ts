import { Environment, environmentsToNetwork } from "./Environment";

describe("environmentToNetwork", () => {
    it("should not create node for environment", () => {
        const environments: Environment[] = [{
            name: "TST",
            servers: []
        }];
        const network = environmentsToNetwork(environments);
        expect(network.nodes).toHaveLength(0);
    });
});