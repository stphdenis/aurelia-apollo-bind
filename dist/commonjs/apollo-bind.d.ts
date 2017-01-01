/// <reference types="typed-graphql" />
import { Document } from 'graphql';
export declare enum SubscriptionMode {
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
    subscriptionMode: SubscriptionMode;
};
export declare function callApolloUpdate(propertyOwner: Object, propertyName: string, newValue: any): void;
export declare class ApolloBind {
    static subscribe(document: Document, variables_propertyName?: string | SubscriptionMode, subscriptionMode?: SubscriptionMode): any;
    static query(document: Document, variables_propertyName?: string): any;
    private static viewModelClasses;
    private static getQueryName(document);
    private static initViewModel(viewModelPrototype, viewModelQuery);
}
