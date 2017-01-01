import ApolloClient, { ObservableQuery, Subscription, WatchQueryOptions } from 'apollo-client';
import { BindingEngine, Container, Disposable } from 'aurelia-framework';
import { Document } from 'graphql';
import gql from 'graphql-tag';

import { ViewModelClass } from './view-model-class';

export enum SubscriptionMode { remote, local };
export enum QueryType { subscribe, query };
export type ViewModelQuery = {
  type: QueryType,
  name: string,
  gql: Document,
  propertyName: string,
  variables_propertyName: string|undefined,
  subscriptionMode: SubscriptionMode,
};
type ViewModelType = {};

export function callApolloUpdate(propertyOwner: Object, propertyName: string, newValue: any): void {
  const oldValue = propertyOwner[propertyName];
  propertyOwner[propertyName] = newValue;
  const apolloUpdateToCall: Function = propertyOwner['apolloUpdate'];
  if (apolloUpdateToCall) {
    apolloUpdateToCall.call(propertyOwner, propertyName, newValue, oldValue);
  }
}

export class ApolloBind {
  static subscribe(document: Document, variables_propertyName?: string|SubscriptionMode, subscriptionMode?: SubscriptionMode): any {
    let _variables_propertyName: string|undefined;
    let _subscriptionMode: SubscriptionMode;
    if(subscriptionMode) {
      _variables_propertyName = variables_propertyName as string|undefined;
      _subscriptionMode = subscriptionMode;
    } else {
      if(typeof variables_propertyName === 'string') {
        _variables_propertyName = variables_propertyName;
        _subscriptionMode = SubscriptionMode.remote;
      } else if(variables_propertyName !== undefined) {
        _variables_propertyName = undefined;
        _subscriptionMode = variables_propertyName as SubscriptionMode;
      } else {
        _variables_propertyName = undefined;
        _subscriptionMode = SubscriptionMode.remote;
      }
    }
    return (viewModelPrototype: Object, propertyName: string) => {
      ApolloBind.initViewModel(viewModelPrototype, {
        type: QueryType.subscribe,
        name: ApolloBind.getQueryName(document),
        gql: document,
        propertyName,
        variables_propertyName: _variables_propertyName,
        subscriptionMode: _subscriptionMode,
      });
    };
  }

  static query(document: Document, variables_propertyName?: string): any {
    return (viewModelPrototype: Object, propertyName: string) => {
      ApolloBind.initViewModel(viewModelPrototype, {
        type: QueryType.query,
        name: ApolloBind.getQueryName(document),
        gql: document,
        propertyName,
        variables_propertyName,
        subscriptionMode: SubscriptionMode.remote,
      });
    };
  }

  private static viewModelClasses: Map<Object, ViewModelClass> = new Map();
  private static getQueryName(document: Document): string {
    return document.definitions[0]['name'].value;
  }

  private static initViewModel(viewModelPrototype: Object, viewModelQuery: ViewModelQuery): void {
    let viewModelClass = ApolloBind.viewModelClasses.get(viewModelPrototype);
    if (viewModelClass === undefined) {
      viewModelClass = new ViewModelClass(viewModelPrototype);
      ApolloBind.viewModelClasses.set(viewModelPrototype, viewModelClass);
    }

    // registers the property to be binded at creation time of the ViewModel
    viewModelClass.addViewModelQueries(viewModelQuery);
  }
}
