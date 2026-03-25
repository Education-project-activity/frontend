import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild, inject,
} from '@angular/core';

import EditorJS, {
  OutputData,
  ToolConstructable,
} from '@editorjs/editorjs';

import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Quote from '@editorjs/quote';
import NestedList from '@editorjs/nested-list';
import Paragraph from '@editorjs/paragraph';
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import ImageTool from '@editorjs/image';
import {ApiConfig} from '../../shared/config/api.config';

const HeaderTool = Header as unknown as ToolConstructable;
const DelimiterTool = Delimiter as unknown as ToolConstructable;
const QuoteTool = Quote as unknown as ToolConstructable;
const NestedListTool = NestedList as unknown as ToolConstructable;
const ParagraphTool = Paragraph as unknown as ToolConstructable;
const MarkerTool = Marker as unknown as ToolConstructable;
const UnderlineTool = Underline as unknown as ToolConstructable;
const ImagesTool = ImageTool as unknown as ToolConstructable;

@Component({
  selector: 'app-editor',
  standalone: true,
  templateUrl: './editor.html',
  styleUrls: ['./editor.scss'],
})
export class Editor implements AfterViewInit, OnDestroy {
  @Input() data: OutputData | null = null;
  apiConfig = inject(ApiConfig);

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
            level: 2,
          },
        },
        header3: {
          class: HeaderTool,
          toolbox: { title: 'Заголовок H3' },
          inlineToolbar: true,
          config: {
            level: 3,
          },
        },
        header4: {
          class: HeaderTool,
          toolbox: { title: 'Заголовок H4' },
          inlineToolbar: true,
          config: {
            level: 4,
          },
        },
        paragraph: {
          class: ParagraphTool,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `${this.apiConfig.getBaseApiUrl()}editor/images/by-file`,
              byUrl: `${this.apiConfig.getBaseApiUrl()}editor/images/by-url`,
            }
          }
        },
        list: {
          class: NestedListTool,
          inlineToolbar: true,
          toolbox: { title: 'Список' },
          config: {
            defaultStyle: 'unordered'
          }
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
        delimiter: {
          class: DelimiterTool,
          toolbox: { title: 'Разделитель' },
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
