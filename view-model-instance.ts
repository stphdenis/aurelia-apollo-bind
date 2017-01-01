import { QueryType, ViewModelQuery } from './apollo-bind';
import { QueryQuery } from './query-query';
import { QueryWatch } from './query-watch';

export class ViewModelInstance {
  private queries: Set<QueryWatch | QueryQuery> = new Set();

  constructor(private viewModelPrototype: Object, private propertyOwner: Object, viewModelQueries: ViewModelQuery[]) {
    viewModelQueries.forEach(viewModelQuery => {
      switch (viewModelQuery.type) {
        case QueryType.subscribe:
          this.queries.add(new QueryWatch(propertyOwner, viewModelQuery));
          break;
        case QueryType.query:
          this.queries.add(new QueryQuery(propertyOwner, viewModelQuery));
          break;
        default:
          throw new Error('ApolloBind only accept query or subscribe');
      }
    });
  }

  destruct(): void {
    this.queries.forEach(query => query.destruct());
  }
}
