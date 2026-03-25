import {Component, inject} from '@angular/core';
import {Topic} from '../../utils/api/topic';
import {User} from '../../utils/api/user';
import {Auth} from '../../utils/api/auth';
import {UserInfoInterface} from '../../entities/user/user-info.interface';
import {TopicPreviewInterface} from '../../entities/topic/topic-preview.interface';
import {forkJoin} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-profile-page',
  imports: [],
  templateUrl: './edit-profile-page.html',
  styleUrl: './edit-profile-page.scss',
})
export class EditProfilePage {
  private readonly userApi = inject(User);
  private readonly auth = inject(Auth);

  author: UserInfoInterface | null = null;
  isLoading = true;

  protected topicForm = new FormGroup({
    title: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
  });

  constructor() {
    const authorId = this.auth.userId;
    if (authorId) {
      this.loadAuthorPage(authorId);
    }
  }

  private loadAuthorPage(authorId: string) {
    this.isLoading = true;
    this.author = null;

      this.userApi.getUserByID(authorId).subscribe({
      next: (author) => {
        this.author = author;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
