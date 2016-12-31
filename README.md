# aurelia-apollo-bind

This module help using `Apollo` queries by binding properties with decorators.

You can `query`, `subscribe` and use an other property for the parameters.
Any time a parameter change, a new query is done.

## Initialisation

You have to inject an instance of ApolloClient :

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

Each time you change the contactId, a new query is done.

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

## TODO

 - Parameter can be an object
 - subscribe is locally only
 - make update similar to the query way with save() and revert() functionalities.

## Update proposition

This is not yet implemented but I need your reactions to make something easy to use and having all the needs.

We can bind functions with the module named contactSave(newData and oldData) and contactRevert().
The save() is called with no-parameter but newData and oldData are transmitted by the module.

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

  detailsSave(newData, oldData) {
    console.info('newData, oldData :', newData, oldData);
  }
  detailsRevert() {}
}
```
