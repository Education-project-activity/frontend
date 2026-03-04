import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Topic} from '../../utils/api/topic';
import {TopicDetailInterface} from '../../entities/topic/topic-detail.interface';
import {Content} from '../../widgets/content/content';
import {Auth} from '../../utils/api/auth';
import {TuiAlertOptions, TuiAlertService, TuiButton, TuiIcon, TuiLink, TuiTextfield} from '@taiga-ui/core';
import {injectContext, PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {Location} from '@angular/common';
import {TuiPopover} from '@taiga-ui/cdk';
import {EMPTY, catchError, switchMap, takeUntil} from 'rxjs';
import {Reaction} from '../../utils/api/reaction';
import {ReactionSummaryInterface, ReactionType} from '../../entities/reaction/reaction-summary.interface';
import {Comment} from '../../utils/api/comment';
import {
  CommentPageInterface,
  CommentResponse,
  CreateCommentRequest
} from '../../entities/comment/comment.interface';
import {Subscription} from '../../utils/api/subscription';
import {TuiMessage, TuiTextarea, TuiTextareaLimit} from '@taiga-ui/kit';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TuiButton],
  template: `
    <p>Вы уверены, что хотите удалить?</p>
    <button
      tuiButton size="s"
      appearance="outline-grayscale"
      class="tui-space_right-1"
      type="button"
      (click)="context.completeWith(true)">
      Да
    </button>

    <button
      tuiButton
      appearance="outline-grayscale"
      size="s"
      type="button"
      (click)="context.completeWith(false)">
      Нет
    </button>`,
})
export class AlertExample {
  context =
    injectContext<TuiPopover<TuiAlertOptions<void>, boolean>>();
}


@Component({
  selector: 'app-topic-page',
  imports: [
    Content,
    RouterLink,
    TuiButton,
    TuiLink,
    TuiIcon,
    TuiTextfield,
    TuiTextarea,
    TuiTextareaLimit,
    TuiMessage
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
})
export class TopicPage {
  private readonly topicApi = inject(Topic);
  private readonly reactionApi = inject(Reaction);
  private readonly commentApi = inject(Comment);
  private readonly subscriptionApi = inject(Subscription);
  topic!: TopicDetailInterface;
  id : string | null = "ID is loading";
  private readonly auth = inject(Auth);
  private readonly location = inject(Location);
  isYourTopic = signal<boolean>(false);
  reactionSummary = signal<ReactionSummaryInterface | null>(null);
  isReactionPickerOpen = signal<boolean>(false);
  commentText = signal<string>('');
  comments = signal<{comment: CommentResponse; depth: number}[]>([]);
  isSubscribed = signal<boolean>(false);
  isSubscriptionLoading = signal<boolean>(false);

  readonly reactionTypes: {type: ReactionType; emoji: string; label: string}[] = [
    {type: 'LOVE', emoji: '❤️', label: 'Любовь'},
    {type: 'LIKE', emoji: '👍', label: 'Нравится'},
    {type: 'LAUGH', emoji: '😄', label: 'Смешно'},
    {type: 'WOW', emoji: '🔥', label: 'Ого'}
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id == null) {
      this.location.back();
    } else {
      this.topicApi.getTopic(this.id)
        .pipe(
        catchError((err) => {
          if (err?.status === 404) {
            this.location.back();
          }

          this.location.back();
          return EMPTY;
        })
      ).subscribe(val => {
        this.topic = val;
        if (this.topic.authorId === this.auth.userId) {
          this.isYourTopic.set(true);
        }
      });
      this.loadReactions();
      this.loadComments();
      this.loadSubscriptionStatus();
    }
  }


  private readonly alerts = inject(TuiAlertService);
  notification = this.alerts
    .open<boolean>(new PolymorpheusComponent(AlertExample), {
      label: 'Подтверждение',
      appearance: 'negative',
      autoClose: 0,
    })
    .pipe(
      switchMap((response) => {
          if (response === true) {
            if (this.id != null) {
              return this.topicApi.deleteTopic(this.id).pipe(
                switchMap(() => {
                  this.location.back();
                  return this.alerts.open('Статья удалена', {
                    label: 'Успешно',
                    appearance: 'success'
                  });
                })
              );
            }
            return this.alerts.open('Не удалось удалить статью', {
              label: 'Ошибка',
              appearance: 'negative'
            });
          } else {
            return this.alerts.open('Удаление отменено', {
              label: 'Информация',
              appearance: 'info'
            });
          }
        }
      ),
      takeUntil(inject(Router).events),
    );

  protected showDeleteNotification(): void {
    this.notification.subscribe();
  }

  toggleReactionPicker() {
    this.isReactionPickerOpen.set(!this.isReactionPickerOpen());
  }

  reactToTopic(type: ReactionType) {
    const topicId = this.id;
    if (!topicId) {
      return;
    }

    const currentReaction = this.reactionSummary()?.currentUserReaction;
    const request$ = currentReaction === type
      ? this.reactionApi.removeFromTopic(topicId)
      : this.reactionApi.reactToTopic(topicId, type);

    request$.pipe(
      switchMap(() => this.reactionApi.getForTopic(topicId))
    ).subscribe(val => {
      this.reactionSummary.set(val);
      this.isReactionPickerOpen.set(false);
    });
  }

  getDisplayReactions() {
    const summary = this.reactionSummary();
    if (!summary) {
      return [];
    }

    const current = summary.currentUserReaction;

    return this.reactionTypes
      .map(item => ({
        ...item,
        count: summary.counts[item.type] ?? 0
      }))
      .filter(item => item.count > 0 || item.type === current);
  }

  private loadReactions() {
    const topicId = this.id;
    if (!topicId) {
      return;
    }

    this.reactionApi.getForTopic(topicId)
      .pipe(
        catchError((err) => {
          if (err?.status === 404) {
            this.location.back();
          }

          this.location.back();
          return EMPTY;
        })
      )
      .subscribe(val => {
        this.reactionSummary.set(val);
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
    const topicId = this.id;
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

  private loadComments() {
    const topicId = this.id;
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

  toggleSubscription() {
    const topicId = this.id;
    if (!topicId) {
      return;
    }

    this.isSubscriptionLoading.set(true);
    const request$ = this.isSubscribed()
      ? this.subscriptionApi.unsubscribeFromTopic(topicId)
      : this.subscriptionApi.subscribeToTopic(topicId);

    request$.pipe(
      switchMap(() => this.subscriptionApi.getTopicStatus(topicId)),
      catchError(() => {
        this.isSubscriptionLoading.set(false);
        return EMPTY;
      })
    ).subscribe(val => {
      this.isSubscribed.set(val.subscribed);
      this.isSubscriptionLoading.set(false);
    });
  }

  private loadSubscriptionStatus() {
    const topicId = this.id;
    if (!topicId) {
      return;
    }

    this.subscriptionApi.getTopicStatus(topicId)
      .subscribe(val => {
        this.isSubscribed.set(val.subscribed);
      });
  }

}
