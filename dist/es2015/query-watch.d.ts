import { ViewModelQuery } from './apollo-bind';
export declare class QueryWatch {
    private apolloClient;
    private bindingEngine;
    private watchQuerySubscriptions;
    private propertyObserverDisposables;
    constructor(propertyOwner: Object, viewModelQuery: ViewModelQuery);
    destruct(): void;
}
