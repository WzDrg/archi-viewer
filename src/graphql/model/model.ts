export interface Snapshot {
    timestamp: Date;
}
export interface Reference {
    type: string;
    name: string;
};

export interface Container {
    name: string;
    uses?: Reference[];
};

export interface SoftwareSystem {
    name: string;
    containers?: Container[];
    uses?: Reference[];
};

export interface ContainerInstance {
    name: string
    container?: Container
}

export interface Server {
    name: string,
    containers: ContainerInstance[]
}

export interface Environment {
    name: string,
    servers: Server[]
}