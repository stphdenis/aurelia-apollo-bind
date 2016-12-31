import { ViewModelQuery } from './apollo-bind';
import { ViewModelInstance } from './view-model-instance';

export class ViewModelClass {
  private viewModelInstances: Map<Object, ViewModelInstance> = new Map();
  private viewModelQueries: ViewModelQuery[] = [];

  constructor(private viewModelPrototype: Object) {
    // adds the call of 'subscribe(this)' to the created function of the target
    // -> to be done once <-
    // the 'created' function must exist in the ViewModel
    const that = this;

    const created = (fn) => {
      return function (...args) {
        that.viewModelInstances.set(this, new ViewModelInstance(viewModelPrototype, this, that.viewModelQueries));
        return fn && fn.apply(this, args);
      };
    };
    Object.defineProperty(viewModelPrototype, 'created', { value: created(viewModelPrototype['created']) });

    const unbind = (fn) => {
      return function (...args) {
        const fnToApplied = fn && fn.apply(this, args);
        const viewModelInstances = that.viewModelInstances.get(this);
        that.viewModelInstances.delete(this);
        if (viewModelInstances) {
          viewModelInstances.destruct();
        }
        return fnToApplied;
      };
    };
    Object.defineProperty(viewModelPrototype, 'unbind', { value: unbind(viewModelPrototype['unbind']) });
  }

  addViewModelQueries(viewModelQuery: ViewModelQuery): void {
    this.viewModelQueries.push(viewModelQuery);
  }
}
