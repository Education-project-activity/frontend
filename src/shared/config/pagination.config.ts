import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationConfig {
  readonly pageSize = 12;

  getPageSize() {
    return this.pageSize;
  }
}
