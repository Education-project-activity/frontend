import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'data'
})
export class DataPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  }
}
