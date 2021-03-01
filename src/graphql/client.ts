import { gql, ApolloClient } from "@apollo/client";
import { TaskEither, right } from "fp-ts/lib/TaskEither";
import { ArchiViewerError } from "../core/error";
import { Environment, SoftwareSystem } from "./model/model";

export const GET_SOFTWARE_SYSTEMS = gql`
    { 
        scalar Date

        softwareSystems(until:Date) {
            name
            containers {
                name
                uses {
                    type
                    name
                }
            }
            uses {
                type
                name
            }
        }
    }
`;

export const getSoftwareSystemsGraphQL = (client: ApolloClient<any>) =>
    (timeStamp: Date): TaskEither<ArchiViewerError, SoftwareSystem[]> =>
        right([]);

const GET_SOFTWARE_SYSTEM_NAMES = gql`
    {
        scalar Date

        softwareSystems(until:Date) {
            name
        }
    }
`;

export const getSoftwareSystemNamesGraphQL = (client: ApolloClient<any>) =>
    (timeStamp: Date): TaskEither<ArchiViewerError, string[]> =>
        right([]);

const GET_ENVIRONMENTS = gql`
    { 
        scalar Date

        environments(until:Date) {
            name
            servers {
                name
                containers {
                    name
                    container {
                        name
                    }
                }
            }
        }
    }
`;

export const getEnvironmentsGraphQL = (client: ApolloClient<any>) =>
    (until: Date): TaskEither<ArchiViewerError, Environment[]> =>
        right([]);