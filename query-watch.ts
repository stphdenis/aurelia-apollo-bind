import ApolloClient, { Subscription } from 'apollo-client';
import { BindingEngine, Container, Disposable } from 'aurelia-framework';

import { callApolloUpdate, SubscriptionMode, ViewModelQuery } from './apollo-bind';

export class QueryWatch {
  private apolloClient = Container.instance.get(ApolloClient);
  private bindingEngine = Container.instance.get(BindingEngine);

  private watchQuerySubscriptions: Map<string, Subscription> = new Map();
  private propertyObserverDisposables: Set<Disposable> = new Set();

  constructor(propertyOwner: Object, viewModelQuery: ViewModelQuery) {
    const watchQuery = this.apolloClient.watchQuery({ query: viewModelQuery.gql });
    if(viewModelQuery.subscriptionMode === SubscriptionMode.remote) {
      watchQuery.startPolling(500);
    }
    if (viewModelQuery.variables_propertyName) {
      watchQuery.setVariables({ id: propertyOwner[viewModelQuery.variables_propertyName] });
      this.bindingEngine.propertyObserver(propertyOwner, viewModelQuery.variables_propertyName)
        .subscribe((newValue, oldValue) => {
          watchQuery.refetch({ id: newValue });
        });
    }
    const subscription = watchQuery.subscribe({
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
