/// <reference types="typed-graphql" />
import { Document } from 'graphql';
export declare enum WatchMode {
    remote = 0,
    local = 1,
}
export declare enum QueryType {
    subscribe = 0,
    query = 1,
}
export declare type ViewModelQuery = {
    type: QueryType;
    name: string;
    gql: Document;
    propertyName: string;
    variables_propertyName: string | undefined;
    watchMode: WatchMode;
};
export declare function callApolloUpdate(propertyOwner: Object, propertyName: string, newValue: any): void;
export declare class ApolloBind {
    static subscribe(document: Document, variables_propertyName?: string | WatchMode, watchMode?: WatchMode): any;
    static query(document: Document, variables_propertyName?: string): any;
    private static viewModelClasses;
    private static getQueryName(document);
    private static initViewModel(viewModelPrototype, viewModelQuery);
}
