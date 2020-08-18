import { Network } from "./Network";

export default interface NetworkServices {
    // Get the network configuration of all software systems
    getSoftwareSystems: () => Promise<Network>;

    // Get a list containing all names of the software systems
    getSoftwareSystemNames: () => Promise<string[]>;

    getEnvironments: () => Promise<Network>;
}

