import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import EditorJS, {
  OutputData,
  ToolConstructable,
} from '@editorjs/editorjs';

import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import NestedList from '@editorjs/nested-list';
import Paragraph from '@editorjs/paragraph';
import CodeTool from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import Marker from '@editorjs/marker';
import Embed from '@editorjs/embed';
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import RawTool from '@editorjs/raw';
import Underline from '@editorjs/underline';

const HeaderTool = Header as unknown as ToolConstructable;
const DelimiterTool = Delimiter as unknown as ToolConstructable;
const QuoteTool = Quote as unknown as ToolConstructable;
const NestedListTool = NestedList as unknown as ToolConstructable;
const ParagraphTool = Paragraph as unknown as ToolConstructable;
const CodeToolC = CodeTool as unknown as ToolConstructable;
const InlineCodeTool = InlineCode as unknown as ToolConstructable;
const MarkerTool = Marker as unknown as ToolConstructable;
const EmbedTool = Embed as unknown as ToolConstructable;
const ChecklistTool = Checklist as unknown as ToolConstructable;
const TableTool = Table as unknown as ToolConstructable;
const RawToolC = RawTool as unknown as ToolConstructable;
const UnderlineTool = Underline as unknown as ToolConstructable;

@Component({
  selector: 'app-editor',
  standalone: true,
  templateUrl: './editor.html',
  styleUrls: ['./editor.scss'],
})
export class Editor implements AfterViewInit, OnDestroy {
  @Input() data: OutputData | null = null;
  @ViewChild('editorJS', { static: true })

  editorHolder!: ElementRef<HTMLDivElement>;

  private editor: EditorJS | null = null;

  ngAfterViewInit(): void {
    this.editor = new EditorJS({
      holder: this.editorHolder.nativeElement,
      placeholder: 'Да начнется сей замечательный рассказ!',
      autofocus: true,
      minHeight: 0,
      data: this.data ?? undefined,

      defaultBlock: 'paragraph',
      tools: {
        header2: {
          class: HeaderTool,
          toolbox: { title: 'Заголовок H2' },
          inlineToolbar: true,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        header3: {
          class: HeaderTool,
          toolbox: { title: 'Заголовок H3' },
          inlineToolbar: true,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        header4: {
          class: HeaderTool,
          toolbox: { title: 'Заголовок H4' },
          inlineToolbar: true,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 4,
          },
        },
        paragraph: {
          class: ParagraphTool,
          inlineToolbar: true,
        },
        list: {
          class: NestedListTool,
          inlineToolbar: true,
          toolbox: { title: 'Список' },
          config: {
            defaultStyle: 'unordered'
          }
        },
        checklist: {
          class: ChecklistTool,
          inlineToolbar: true,
          toolbox: { title: 'Чеклист' },
        },
        embed: {
          class: EmbedTool,
          toolbox: { title: 'Вставка видео' },
          config: {
            services: {
              youtube: true,
              coub: true,
              imgur: true
            }
          }
        },
        table: {
          class: TableTool,
          inlineToolbar: true,
          toolbox: { title: 'Таблица' },
        },
        quote: {
          class: QuoteTool,
          toolbox: { title: 'Цитата' },
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Текст цитаты',
            captionPlaceholder: 'Автор',
          },
        },
        code: {
          class: CodeToolC,
          toolbox: { title: 'Код' },
        },
        raw: {
          class: RawToolC,
          toolbox: { title: 'HTML' },
        },
        delimiter: {
          class: DelimiterTool,
          toolbox: { title: 'Разделитель' },
        },

        inlineCode: {
          class: InlineCodeTool,
        },
        marker: {
          class: MarkerTool,
          shortcut: 'CMD+SHIFT+M',
        },
        underline: {
          class: UnderlineTool,
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
    this.editor = null;
  }

  async getData(): Promise<OutputData | null> {
    try {
      if (this.editor !== null) {
        return await this.editor!.save();
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
