import NetworkServices from "./proxy/networkServices";
import { Network, Node, isSoftwareSystem, isContainer, removeNodeFromNetwork, collapseNodeOntoParent, ofSoftwareSystem, softwareSystemId } from "./model/network";
import { TaskEither, map } from "fp-ts/lib/TaskEither";
import { ArchiViewerError } from "./error";
import { pipe } from "fp-ts/lib/pipeable";

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
    (options: NetworkDisplayOptions): TaskEither<ArchiViewerError, Network> =>
        options.level === "D"
            ? networkServices.getEnvironments(options.date ?? new Date())
            : pipe(
                networkServices.getSoftwareSystems(options.date ?? new Date()),
                map(collapseContainers(options))
            );

// Retrieve a list of all names of software systems
const getSoftwareSystemNames = (networkServices: NetworkServices) =>
    networkServices.getSoftwareSystemNames;

const getEnvironments = (networkServices: NetworkServices) =>
    networkServices.getEnvironments;

// Default definition of the core services available
export interface CoreServices {
    getNetwork: (options: NetworkDisplayOptions) => TaskEither<ArchiViewerError, Network>;
    getSoftwareSystemNames: (until: Date) => TaskEither<ArchiViewerError, string[]>;
}

export const coreServices = (networkServices: NetworkServices) => ({
    getNetwork: getNetwork(networkServices),
    getSoftwareSystemNames: getSoftwareSystemNames(networkServices),
    getEnvironments: getEnvironments(networkServices)
})
