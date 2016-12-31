import { ViewModelQuery } from './apollo-bind';
export declare class ViewModelClass {
    private viewModelPrototype;
    private viewModelInstances;
    private viewModelQueries;
    constructor(viewModelPrototype: Object);
    addViewModelQueries(viewModelQuery: ViewModelQuery): void;
}
