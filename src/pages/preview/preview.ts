import { Component } from '@angular/core';
import {TopicPreview} from '../../widgets/topic-preview/topic-preview';

@Component({
  selector: 'app-preview',
  imports: [
    TopicPreview
  ],
  templateUrl: './preview.html',
  styleUrl: './preview.scss'
})
export class Preview {
}
