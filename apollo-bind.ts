import ApolloClient, { ObservableQuery, Subscription, WatchQueryOptions } from 'apollo-client';
import { BindingEngine, Container, Disposable } from 'aurelia-framework';
import { Document } from 'graphql';
import gql from 'graphql-tag';

import { ViewModelClass } from './view-model-class';

export enum QueryTypeEnum { subscribe, query };
export type ViewModelQuery = {
  type: QueryTypeEnum,
  name: string,
  gql: Document,
  propertyName: string,
  variables_propertyName: string|undefined,
};
type ViewModelType = {};

export function callApolloUpdate(propertyOwner: Object, propertyName: string, newValue: any): void {
  const oldValue = propertyOwner[propertyName];
  propertyOwner[propertyName] = newValue;
  console.info('ApolloBind - callApolloUpdate - propertyName, propertyOwner :', propertyName, propertyOwner);
  console.info('ApolloBind - callApolloUpdate - newValue, oldValue :', newValue, oldValue);

  const apolloUpdateToCall: Function = propertyOwner['apolloUpdate'];
  if (apolloUpdateToCall) {
    apolloUpdateToCall.call(propertyOwner, propertyName, newValue, oldValue);
  }
}

export class ApolloBind {
  static subscribe(document: Document, variables_propertyName?: string): any {
    return (viewModelPrototype: Object, propertyName: string) => {
      ApolloBind.initViewModel(viewModelPrototype, {
        type: QueryTypeEnum.subscribe,
        name: ApolloBind.getQueryName(document),
        gql: document,
        propertyName,
        variables_propertyName,
      });
    };
  }

  static query(document: Document, variables_propertyName?: string): any {
    return (viewModelPrototype: Object, propertyName: string) => {
      ApolloBind.initViewModel(viewModelPrototype, {
        type: QueryTypeEnum.query,
        name: ApolloBind.getQueryName(document),
        gql: document,
        propertyName,
        variables_propertyName,
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
