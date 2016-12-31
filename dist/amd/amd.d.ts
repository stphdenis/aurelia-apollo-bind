/// <reference types="typed-graphql" />
declare module "query-query" {
    import { ViewModelQuery } from "apollo-bind";
    export class QueryQuery {
        private apolloClient;
        private bindingEngine;
        private propertyObserverDisposables;
        constructor(propertyOwner: Object, viewModelQuery: ViewModelQuery);
        destruct(): void;
    }
}
declare module "query-watch" {
    import { ViewModelQuery } from "apollo-bind";
    export class QueryWatch {
        private apolloClient;
        private bindingEngine;
        private watchQuerySubscriptions;
        private propertyObserverDisposables;
        constructor(propertyOwner: Object, viewModelQuery: ViewModelQuery);
        destruct(): void;
    }
}
declare module "view-model-instance" {
    import { ViewModelQuery } from "apollo-bind";
    export class ViewModelInstance {
        private viewModelPrototype;
        private propertyOwner;
        private queries;
        constructor(viewModelPrototype: Object, propertyOwner: Object, viewModelQueries: ViewModelQuery[]);
        destruct(): void;
    }
}
declare module "view-model-class" {
    import { ViewModelQuery } from "apollo-bind";
    export class ViewModelClass {
        private viewModelPrototype;
        private viewModelInstances;
        private viewModelQueries;
        constructor(viewModelPrototype: Object);
        addViewModelQueries(viewModelQuery: ViewModelQuery): void;
    }
}
declare module "apollo-bind" {
    import { Document } from 'graphql';
    export enum QueryTypeEnum {
        subscribe = 0,
        query = 1,
    }
    export type ViewModelQuery = {
        type: QueryTypeEnum;
        name: string;
        gql: Document;
        propertyName: string;
        variables_propertyName: string | undefined;
    };
    export function callApolloUpdate(propertyOwner: Object, propertyName: string, newValue: any): void;
    export class ApolloBind {
        static subscribe(document: Document, variables_propertyName?: string): any;
        static query(document: Document, variables_propertyName?: string): any;
        private static viewModelClasses;
        private static getQueryName(document);
        private static initViewModel(viewModelPrototype, viewModelQuery);
    }
}
declare module "index" {
    export { ApolloBind } from "apollo-bind";
}
