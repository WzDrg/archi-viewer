import { graphqlNetworkServices } from "../graphQLServices";
import { createMockClient } from "mock-apollo-client";
import { GET_SOFTWARE_SYSTEMS } from "../client";

describe("Get software systems", () => {
    it("should construct a network with a single software system", async () => {
        const client = createMockClient();
        const snapshot = { timestamp: new Date() };
        client.setRequestHandler(GET_SOFTWARE_SYSTEMS, (timestamp: Date) => Promise.resolve({ data: snapshot }));
        const services = graphqlNetworkServices(client);
        const result = await services.getSoftwareSystems(new Date())();
        expect(result).toEqualRight({ links: [], nodes: [] })
    });
});