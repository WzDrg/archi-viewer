import { right } from "fp-ts/lib/TaskEither";
import { coreServices } from "../coreServices";

describe("Get network", () => {
    it("should construct a network", async () => {
        const networkServices = {
            getSoftwareSystems: jest.fn(),
            getSoftwareSystemNames: jest.fn(),
            getEnvironments: jest.fn()
        }
        networkServices.getSoftwareSystems.mockReturnValueOnce(right({ links: [], nodes: [] }));
        const services = coreServices(networkServices);
        const options = { level: "C2", date: new Date() };
        const result = await services.getNetwork(options)();
        expect(networkServices.getSoftwareSystems).toHaveBeenCalledWith(options.date);
        expect(result).toEqualRight({ links: [], nodes: [] });
    });
});