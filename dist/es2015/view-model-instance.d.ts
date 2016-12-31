import { ViewModelQuery } from './apollo-bind';
export declare class ViewModelInstance {
    private viewModelPrototype;
    private propertyOwner;
    private queries;
    constructor(viewModelPrototype: Object, propertyOwner: Object, viewModelQueries: ViewModelQuery[]);
    destruct(): void;
}
