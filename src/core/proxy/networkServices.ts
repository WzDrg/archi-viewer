import { TaskEither } from "fp-ts/lib/TaskEither";
import { ArchiViewerError } from "../error";
import { Network } from "../model/network";

export default interface NetworkServices {
    getSoftwareSystems: (until: Date) => TaskEither<ArchiViewerError, Network>

    getSoftwareSystemNames: (until: Date) => TaskEither<ArchiViewerError, string[]>;

    getEnvironments: (until: Date) => TaskEither<ArchiViewerError, Network>
}

