# aurelia-apollo-bind

This module help using `Apollo` queries by binding properties with decorators.

You can `query` or `subscribe` and use an other property for the parameters.
Any time a parameter change, a new query is done.

## Initialisation

You have to inject an instance of `ApolloClient` :

```typescript
import { Container } from 'aurelia-dependency-injection';
import ApolloClient from 'apollo-client';
...
  const apolloClient = new ApolloClient(...);
  Container.instance.registerInstance(ApolloClient, apolloClient);
...
```

## Use

```typescript
import { ApolloBind } from 'aurelia-apollo-bind';
import gql from 'graphql-tag';

export class ContactList {
  @ApolloBind.query(gql`
query contactList {
  contactList {
    id
    ...
  }
}`)
  contacts;
}
```

By just changing `query` by `subscribe`, your query will be updated each time an update is done locally or from the server or from an other client.

## Parameters

Each time you change the `detailsId` property, a new query is done.

```typescript
import { ApolloBind } from 'aurelia-apollo-bind';
import gql from 'graphql-tag';

export class ContactDetails {
  @ApolloBind.query(gql`
query contactDetails($id: ID) {
  contactDetails(id: $id) {
    id
    ...
  }
}`, 'detailsId')
  details;
  detailsId;
}
```

## Subscription mode

```typescript
import { ApolloBind, SubscriptionMode } from 'aurelia-apollo-bind';
import gql from 'graphql-tag';

export class ContactList {
  @ApolloBind.subscribe(gql`
query contactList {
  contactList {
    id
    ...
  }
}`, SubscriptionMode.local)
  contacts;
}
```

If you're pulling the server and don't use `ws` then the `SubscriptionMode` can help you to force the sync of your app only locally for this query.

## TODO

 - decorate the class to have general default class inits (pulling time, SubscriptionMode)
 - Init the module to force defaults (by default, pulling timing is 500ms and SubscriptionMode is remote)
 - Parameter can be an object
 - have SubscriptionMode.local with `ws` too
 - have a decorator like `@ApolloBind.local` to replace `SubscriptionMode.local`
 - make update similar to the query way with `save` and `revert` functionalities.

Any suggestion is welcome !

## Update proposition

This is not yet implemented but I need your reactions to make something easy to use and having all the needs.

We can bind functions with the module named `contactSave(newData and oldData)` and `contactRevert()`.
The `save()` is called with no-parameter but `newData` and `oldData` are transmitted by the module.

```typescript
export class contactDetails {
  @ApolloBind.query(..., detailsId)
  @ApolloBind.update(gql`
mutation saveContact($id: ID, ...) {
  saveContact(
    id: $id,
    ...
  ) {
    id
    ...
  }
}`)
  details;
  detailsId;

  somewhereElse() {
    if ... detailsSave() ... else ... detailsRevert() ...
  }

  detailsSave(datas?: Promise<{newData, oldData}>) {
    if(datas)
      datas.then((newData, oldData) => console.info('newData, oldData :', newData, oldData));
  }
  detailsRevert() {}
}
```

`contactSave` and `contactRevert` functions don't have to be there in javascript if we don't need the returned promise.
In typescript, we need them cause of type cheking.
