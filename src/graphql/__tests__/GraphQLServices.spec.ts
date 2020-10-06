import { graphqlNetworkServices } from "../GraphQLServices"

describe("GraphQLServices", () => {
    it.skip("should get the software systems", async () => {
        const services = graphqlNetworkServices("http://localhost:4000/graphql");
        const network = await services.getSoftwareSystems();
        expect(network).toHaveProperty("nodes");
    })

});
