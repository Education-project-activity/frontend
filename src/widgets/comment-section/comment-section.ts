import {Component, inject, Input, signal} from '@angular/core';
import {TuiButton, TuiLabel, TuiTextfieldComponent} from "@taiga-ui/core";
import {TuiMessage, TuiTextarea, TuiTextareaLimit} from "@taiga-ui/kit";
import {Comment} from '../../utils/api/comment';
import {catchError, EMPTY, switchMap} from 'rxjs';
import {CommentPageInterface, CommentResponse, CreateCommentRequest} from '../../entities/comment/comment.interface';
import {Location} from '@angular/common';

@Component({
  selector: 'app-comment-section',
    imports: [
        TuiButton,
        TuiLabel,
        TuiMessage,
        TuiTextarea,
        TuiTextareaLimit,
        TuiTextfieldComponent
    ],
  templateUrl: './comment-section.html',
  styleUrl: './comment-section.scss',
})
export class CommentSection {
  @Input() topicId: string | null = null;
  private readonly location = inject(Location);
  private readonly commentApi = inject(Comment);
  commentText = signal<string>('');
  comments = signal<{comment: CommentResponse; depth: number}[]>([]);

  ngOnInit() {
    this.loadComments();
  }

  private loadComments() {
    const topicId = this.topicId;
    if (!topicId) {
      return;
    }

    this.commentApi.getByTopic(topicId)
      .pipe(
        catchError((err) => {
          if (err?.status === 404) {
            this.location.back();
          }

          this.location.back();
          return EMPTY;
        })
      )
      .subscribe((page: CommentPageInterface) => {
        this.comments.set(this.flattenComments(page.content));
      });
  }

  onCommentInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.commentText.set(target.value);
  }

  canSubmitComment() {
    return this.commentText().trim().length > 0;
  }

  submitComment() {
    const topicId = this.topicId;
    const content = this.commentText().trim();
    if (!topicId || !content) {
      return;
    }

    const payload: CreateCommentRequest = {
      topic_id: topicId,
      parent_id: null,
      content
    };

    this.commentApi.create(payload)
      .pipe(
        switchMap(() => this.commentApi.getByTopic(topicId)),
        catchError((err) => {
          if (err?.status === 404) {
            this.location.back();
          }

          this.location.back();
          return EMPTY;
        })
      )
      .subscribe((page: CommentPageInterface) => {
        this.commentText.set('');
        this.comments.set(this.flattenComments(page.content));
      });
  }

  private flattenComments(comments: CommentResponse[], depth = 0) {
    const result: {comment: CommentResponse; depth: number}[] = [];

    comments.forEach(comment => {
      result.push({comment, depth});
      if (comment.replies?.length) {
        result.push(...this.flattenComments(comment.replies, depth + 1));
      }
    });

    return result;
  }

}
