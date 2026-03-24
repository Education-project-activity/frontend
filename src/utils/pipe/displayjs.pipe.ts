import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import edjsHTML from 'editorjs-html';
import {OutputData} from '@editorjs/editorjs/types/data-formats/output-data';

@Pipe({
  standalone: true,
  name: 'displayjs',
})
export class DisplayjsPipe implements PipeTransform {
  private readonly edjsParser = edjsHTML({
    header2: (block) => this.parseHeader(block),
    header3: (block) => this.parseHeader(block),
    header4: (block) => this.parseHeader(block),
    paragraph: (block) => this.parseParagraph(block),
    list: (block) => this.parseList(block),
    quote: (block) => this.parseQuote(block),
    delimiter: () => this.parseDelimiter(),
  });

  constructor(private sanitizer: DomSanitizer) {}

  transform(editorData: OutputData | null): SafeHtml {
    if (!editorData || !editorData.blocks || !Array.isArray(editorData.blocks)) {
      return '';
    }

    try {
      const htmlString = this.edjsParser.parse(editorData);

      return this.sanitizer.bypassSecurityTrustHtml(htmlString);
    } catch (error) {
      console.error('Ошибка при парсинге данных EditorJS:', error);
      return '';
    }
  }

  private parseParagraph(block: any): string {
    const { text } = block.data;

    return `<p>${text}</p>`;
  }

  private parseHeader(block: any): string {
    const { level, text } = block.data;

    return `<h${level}>${text}</h${level}>`;
  }

  private parseList(block: any): string {
    const { items, style } = block.data;
    const tag = style === 'ordered' ? 'ol' : 'ul';

    const renderItems = (listItems: any[]): string => listItems.map((item: any) => {
      if (!item?.content && !item?.items) {
        return `<li>${item}</li>`;
      }

      const nested = item?.items?.length ? renderItems(item.items) : '';
      return `<li>${item.content ?? ''}${nested ? `<${tag}>${nested}</${tag}>` : ''}</li>`;
    }).join('');

    return `<${tag}>${renderItems(items ?? [])}</${tag}>`;
  }

  private parseQuote(block: any): string {
    const { text, caption, alignment } = block.data;

    return `<q>
<p class="text">${text}</p>
<p class="caption">${caption}</p>
</q>`;
  }

  private parseDelimiter(): string {
    return `<hr>`;
  }
}
