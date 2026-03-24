import {Component, inject, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '../../utils/pipe/data.pipe';
import {TuiIcon} from '@taiga-ui/core';
import {TopicPreviewInterface} from '../../entities/topic/topic-preview.interface';

@Component({
  selector: 'app-topic-preview',
  imports: [
    RouterLink,
    DatePipe,
    TuiIcon
  ],
  templateUrl: './topic-preview.html',
  styleUrl: './topic-preview.scss'
})
export class TopicPreview {
  @Input() topic!: TopicPreviewInterface;

  constructor() {
  }
}
