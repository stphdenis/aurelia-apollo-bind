import ApolloClient from 'apollo-client';
import { BindingEngine, Container, Disposable } from 'aurelia-framework';

import { callApolloUpdate, ViewModelQuery } from './apollo-bind';

export class QueryQuery {
  private apolloClient = Container.instance.get(ApolloClient);
  private bindingEngine = Container.instance.get(BindingEngine);

  private propertyObserverDisposables: Set<Disposable> = new Set();

  constructor(propertyOwner: Object, viewModelQuery: ViewModelQuery) {

    if (viewModelQuery.variables_propertyName) {
      this.apolloClient.query({
        query: viewModelQuery.gql,
        variables: { id: propertyOwner[viewModelQuery.variables_propertyName] },
      }) .then(response => {
            callApolloUpdate(propertyOwner, viewModelQuery.propertyName, response.data[viewModelQuery.name]);
          })
          .catch(error => console.error(viewModelQuery.name + ' - Query error(error) :', error));
      this.propertyObserverDisposables.add(
        this.bindingEngine.propertyObserver(propertyOwner, viewModelQuery.variables_propertyName)
          .subscribe((newVariables, oldVariables) => {
            this.apolloClient.query({ query: viewModelQuery.gql, variables: { id: newVariables } })
              .then(response => {
                const data = response.data[viewModelQuery.name];
                callApolloUpdate(propertyOwner, viewModelQuery.propertyName, data);
              })
              .catch(error => console.error(viewModelQuery.name + ' - Query error(error) :', error));
          }),
      );
    } else {
      this.apolloClient.query({ query: viewModelQuery.gql })
        .then(response => {
          callApolloUpdate(propertyOwner, viewModelQuery.propertyName, response.data[viewModelQuery.name]);
        })
        .catch(error => console.error(viewModelQuery.name + ' - Query error(error) :', error));
    }
  }

  destruct(): void {
    this.propertyObserverDisposables.forEach(disposable => disposable.dispose());
  }
}
