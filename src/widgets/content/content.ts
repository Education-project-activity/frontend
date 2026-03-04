import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
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
const ImageToolC = ImageTool as unknown as ToolConstructable;
const QuoteTool = Quote as unknown as ToolConstructable;
const NestedListTool = NestedList as unknown as ToolConstructable;
const ParagraphTool = Paragraph as unknown as ToolConstructable;
const CodeToolC = CodeTool as unknown as ToolConstructable;
const InlineCodeTool = InlineCode as unknown as ToolConstructable;
const LinkToolC = LinkTool as unknown as ToolConstructable;
const MarkerTool = Marker as unknown as ToolConstructable;
const EmbedTool = Embed as unknown as ToolConstructable;
const ChecklistTool = Checklist as unknown as ToolConstructable;
const TableTool = Table as unknown as ToolConstructable;
const RawToolC = RawTool as unknown as ToolConstructable;
const UnderlineTool = Underline as unknown as ToolConstructable;

@Component({
  selector: 'app-content',
  standalone: true,
  templateUrl: './content.html',
  styleUrls: ['./content.scss'],
})
export class Content implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: OutputData | null | undefined = null;

  @ViewChild('editorHolder', { static: true })
  editorHolder!: ElementRef<HTMLDivElement>;

  private editor: EditorJS | null = null;
  private viewInitialized = false;

  async ngAfterViewInit(): Promise<void> {
    this.viewInitialized = true;
    await this.renderEditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.viewInitialized) {
      void this.renderEditor();
    }
  }

  async ngOnDestroy(): Promise<void> {
    await this.destroyEditor();
  }

  private async renderEditor(): Promise<void> {
    if (!this.viewInitialized || !this.data) {
      await this.destroyEditor();
      return;
    }

    await this.destroyEditor();

    try {
      this.editor = new EditorJS({
        holder: this.editorHolder.nativeElement,
        readOnly: true,
        minHeight: 0,
        data: this.data,
        tools: {
          header2: {
            class: HeaderTool,
            inlineToolbar: true,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 2,
            }
          },
          header3: {
            class: HeaderTool,
            inlineToolbar: true,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 3,
            }
          },
          header4: {
            class: HeaderTool,
            inlineToolbar: true,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 4,
            }
          },
          paragraph: {
            class: ParagraphTool,
            inlineToolbar: true,
          },
          list: {
            class: NestedListTool,
            inlineToolbar: true,
          },
          checklist: {
            class: ChecklistTool,
            inlineToolbar: true,
          },
          embed: {
            class: EmbedTool,
          },
          table: {
            class: TableTool,
            inlineToolbar: true,
          },
          quote: {
            class: QuoteTool,
            inlineToolbar: true,
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
          }
        },
      });

      await this.editor.isReady;
    } catch (error) {
      console.error('Не удалось отобразить контент EditorJS', error);
      await this.destroyEditor();
    }
  }

  private async destroyEditor(): Promise<void> {
    if (!this.editor) {
      this.editorHolder.nativeElement.innerHTML = '';
      return;
    }

    await this.editor.isReady;
    this.editor.destroy();
    this.editor = null;
    this.editorHolder.nativeElement.innerHTML = '';
  }
}
