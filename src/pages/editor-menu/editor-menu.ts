import {Component, inject} from '@angular/core';
import {TopicPreview} from "../../widgets/topic-preview/topic-preview";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Topic} from '../../utils/api/topic';
import {User} from '../../utils/api/user';
import {Auth} from '../../utils/api/auth';
import {UserInfoInterface} from '../../entities/user/user-info.interface';
import {TopicPreviewInterface} from '../../entities/topic/topic-preview.interface';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-editor-menu',
  imports: [
    TopicPreview,
    RouterLink
  ],
  templateUrl: './editor-menu.html',
  styleUrl: './editor-menu.scss',
})
export class EditorMenu {
  private readonly route = inject(ActivatedRoute);
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
