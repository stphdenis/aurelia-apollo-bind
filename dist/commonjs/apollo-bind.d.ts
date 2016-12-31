/// <reference types="typed-graphql" />
import { Document } from 'graphql';
export declare enum QueryTypeEnum {
    subscribe = 0,
    query = 1,
}
export declare type ViewModelQuery = {
    type: QueryTypeEnum;
    name: string;
    gql: Document;
    propertyName: string;
    variables_propertyName: string | undefined;
};
export declare function callApolloUpdate(propertyOwner: Object, propertyName: string, newValue: any): void;
export declare class ApolloBind {
    static subscribe(document: Document, variables_propertyName?: string): any;
    static query(document: Document, variables_propertyName?: string): any;
    private static viewModelClasses;
    private static getQueryName(document);
    private static initViewModel(viewModelPrototype, viewModelQuery);
}
