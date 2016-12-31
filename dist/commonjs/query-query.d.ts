import { ViewModelQuery } from './apollo-bind';
export declare class QueryQuery {
    private apolloClient;
    private bindingEngine;
    private propertyObserverDisposables;
    constructor(propertyOwner: Object, viewModelQuery: ViewModelQuery);
    destruct(): void;
}
