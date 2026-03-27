import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {forkJoin} from 'rxjs';
import {TopicPreview} from '../../widgets/topic-preview/topic-preview';
import {Topic} from '../../utils/api/topic';
import {User} from '../../utils/api/user';
import {UserInfoInterface} from '../../entities/user/user-info.interface';
import {TopicPreviewInterface} from '../../entities/topic/topic-preview.interface';
import {Auth} from '../../utils/api/auth';
import {TuiButton} from '@taiga-ui/core';

@Component({
  selector: 'app-me-page',
  imports: [
    TopicPreview,
    TuiButton,
    RouterLink
  ],
  templateUrl: './me-page.html',
  styleUrl: './me-page.scss',
})
export class MePage {
  private readonly topicApi = inject(Topic);
  private readonly userApi = inject(User);
  private readonly auth = inject(Auth);

  author: UserInfoInterface | null = null;
  topics: TopicPreviewInterface[] = [];
  isLoading = true;

  constructor() {
    const authorId = this.auth.userId;
    if (authorId) {
      this.loadAuthorPage(authorId);
    }
  }

  private loadAuthorPage(authorId: string) {
    this.isLoading = true;
    this.author = null;
    this.topics = [];

    forkJoin({
      author: this.userApi.getUserByID(authorId),
      topics: this.topicApi.getTopicsByAuthor(authorId)
    }).subscribe({
      next: ({author, topics}) => {
        this.author = author;
        this.topics = topics;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
