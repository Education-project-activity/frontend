import {Component, Input, ViewEncapsulation} from '@angular/core';
import {DisplayjsPipe} from '../../utils/pipe/displayjs.pipe';
import {OutputData} from '@editorjs/editorjs';

@Component({
  selector: 'app-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './content.html',
  styleUrls: ['./content.scss'],
  imports: [
    DisplayjsPipe
  ]
})
export class Content {
  @Input() data: OutputData | null = null;
}
