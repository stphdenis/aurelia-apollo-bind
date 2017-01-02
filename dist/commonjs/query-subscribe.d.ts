import { ViewModelQuery } from './apollo-bind';
export declare class QuerySubscribe {
    private apolloClient;
    private bindingEngine;
    constructor(propertyOwner: Object, viewModelQuery: ViewModelQuery);
    destruct(): void;
}
