import NetworkServices from "./NetworkServices";
import { Network, Node, isSoftwareSystem, isContainer, removeNodeFromNetwork, collapseNodeOntoParent, ofSoftwareSystem, softwareSystemId } from "./Network";

export interface NetworkDisplayOptions {
    softwareSystem?: string;
    date?: Date;
    level: string;
    environment?: string;
};

export const isNodeVisible = (network: Network, options: NetworkDisplayOptions) =>
    (node: Node) => {
        if (isSoftwareSystem(node))
            return true;
        else if (isContainer(node))
            return (options.level === 'C2' || options.level === "C3" || options.level === "D")
                && (!options.softwareSystem || ofSoftwareSystem(network, softwareSystemId(options.softwareSystem))(node));
        return true;
    }

export const filterShowSoftwareSystem = (showSoftwareSystem: boolean) =>
    (network: Network) =>
        showSoftwareSystem
            ? network
            : network.nodes.reduce((result, node) => {
                return isSoftwareSystem(node) ? removeNodeFromNetwork(node)(result) : result
            }, network);

const collapseContainers = (options: NetworkDisplayOptions) =>
    (network: Network) =>
        network.nodes.reduce((result, node) =>
            (isContainer(node) && !isNodeVisible(network, options)(node))
                ? collapseNodeOntoParent(node)(result)
                : result,
            network);

const getNetwork = (networkServices: NetworkServices) =>
    async (options: NetworkDisplayOptions) =>
        options.level === "D"
            ? await networkServices.getEnvironments(options.date??new Date())
            : collapseContainers(options)(
                await networkServices.getSoftwareSystems(options.date??new Date()));

// Retrieve a list of all names of software systems
const getSoftwareSystemNames = (networkServices: NetworkServices) =>
    networkServices.getSoftwareSystemNames;

const getEnvironments = (networkServices: NetworkServices) =>
    networkServices.getEnvironments;

// Default definition of the core services available
export interface CoreServices {
    getNetwork: (options: NetworkDisplayOptions) => Promise<Network>;
    getSoftwareSystemNames: (until:Date) => Promise<string[]>;
}

export const coreServices = (networkServices: NetworkServices) => ({
    getNetwork: getNetwork(networkServices),
    getSoftwareSystemNames: getSoftwareSystemNames(networkServices),
    getEnvironments: getEnvironments(networkServices)
})
