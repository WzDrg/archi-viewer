import { Network } from "./Network";

export default interface NetworkServices {
    // Get the network configuration of all software systems
    getSoftwareSystems: (until:Date) => Promise<Network>;

    // Get a list containing all names of the software systems
    getSoftwareSystemNames: (until:Date) => Promise<string[]>;

    getEnvironments: (until:Date) => Promise<Network>;
}

