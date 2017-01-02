import ApolloClient, { Subscription } from 'apollo-client';
import { BindingEngine, Container, Disposable } from 'aurelia-framework';

import { callApolloUpdate, WatchMode, ViewModelQuery } from './apollo-bind';

export class QuerySubscribe {
  private apolloClient: ApolloClient = Container.instance.get(ApolloClient);
  private bindingEngine: BindingEngine = Container.instance.get(BindingEngine);

  constructor(propertyOwner: Object, viewModelQuery: ViewModelQuery) {
    const subscribeQuery = this.apolloClient.subscribe({ query: viewModelQuery.gql });
//    if(viewModelQuery.subscriptionMode === SubscriptionMode.remote) {
//      watchQuery.startPolling(500);
//    }
    if (viewModelQuery.variables_propertyName) {
      watchQuery.setVariables({ id: propertyOwner[viewModelQuery.variables_propertyName] });
      this.bindingEngine.propertyObserver(propertyOwner, viewModelQuery.variables_propertyName)
        .subscribe((newValue, oldValue) => {
          watchQuery.refetch({ id: newValue });
        });
    }
    const subscription = subscribeQuery.subscribe({
      next(response: {data: any[]}): void {
        callApolloUpdate(propertyOwner, viewModelQuery.propertyName, response.data[viewModelQuery.name]);
      },
      error(error: any): void { console.error(viewModelQuery.name + 'Query error(error):', error); },
    });
    this.watchQuerySubscriptions.set(viewModelQuery.propertyName, subscription);
  }

  destruct(): void {
    this.watchQuerySubscriptions.forEach(subscription => subscription.unsubscribe());
    this.propertyObserverDisposables.forEach(disposable => disposable.dispose());
  }
}