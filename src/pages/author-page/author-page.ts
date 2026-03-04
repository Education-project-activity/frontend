import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';
import {TopicPreview} from '../../widgets/topic-preview/topic-preview';
import {Topic} from '../../utils/api/topic';
import {User} from '../../utils/api/user';
import {UserInfoInterface} from '../../entities/user/user-info.interface';
import {TopicPreviewInterface} from '../../entities/topic/topic-preview.interface';

@Component({
  selector: 'app-author-page',
  imports: [
    TopicPreview
  ],
  templateUrl: './author-page.html',
  styleUrl: './author-page.scss',
})
export class AuthorPage {
  private readonly route = inject(ActivatedRoute);
  private readonly topicApi = inject(Topic);
  private readonly userApi = inject(User);

  author: UserInfoInterface | null = null;
  topics: TopicPreviewInterface[] = [];
  isLoading = true;

  constructor() {
    const authorId = this.route.snapshot.paramMap.get('id');
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
