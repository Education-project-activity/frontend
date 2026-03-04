import {Component, inject, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DataPipe} from '../../utils/pipe/data.pipe';
import {TuiIcon} from '@taiga-ui/core';
import {UserInfoInterface} from '../../entities/user/user-info.interface';
import {User} from '../../utils/api/user';
import {TopicPreviewInterface} from '../../entities/topic/topic-preview.interface';

@Component({
  selector: 'app-topic-preview',
  imports: [
    RouterLink,
    DataPipe,
    TuiIcon
  ],
  templateUrl: './topic-preview.html',
  styleUrl: './topic-preview.scss'
})
export class TopicPreview {
  @Input() topic!: TopicPreviewInterface;
  author: UserInfoInterface | null = null;
  private readonly userApi = inject(User);

  constructor() {
    if (this.topic) {
      this.userApi.getUserByID(this.topic.id).subscribe(val => {
        this.author = val;
      });
    }
  }
}
