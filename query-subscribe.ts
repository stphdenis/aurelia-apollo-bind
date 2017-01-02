import ApolloClient, { Subscription } from 'apollo-client';
import { Observable } from 'apollo-client/util/Observable';
import { BindingEngine, Container, Disposable } from 'aurelia-framework';

import { callApolloUpdate, WatchMode, ViewModelQuery } from './apollo-bind';

export class QuerySubscribe {
  private apolloClient: ApolloClient = Container.instance.get(ApolloClient);
  private bindingEngine: BindingEngine = Container.instance.get(BindingEngine);

  constructor(propertyOwner: Object, viewModelQuery: ViewModelQuery) {
    let subscribeQuery: Observable<any>;
    if (viewModelQuery.variables_propertyName) {
      subscribeQuery = this.apolloClient.subscribe({
        query: viewModelQuery.gql,
        variables: propertyOwner[viewModelQuery.variables_propertyName],
      });
    } else {
      subscribeQuery = this.apolloClient.subscribe({ query: viewModelQuery.gql });
    }
    const subscription = subscribeQuery.subscribe({
      next(response: {data: any[]}): void {
        console.error('subscribeQuery.subscribe - :', response.data);
//        callApolloUpdate(propertyOwner, viewModelQuery.propertyName, response.data[viewModelQuery.name]);
      },
      error(error: any): void { console.error(viewModelQuery.name + 'Query error(error):', error); },
    });
//    this.subscribeSubscriptions.set(viewModelQuery.propertyName, subscription);
  }

  destruct(): void {
//    this.subscribeSubscriptions.forEach(subscription => subscription.unsubscribe());
//    this.propertyObserverDisposables.forEach(disposable => disposable.dispose());
  }
}