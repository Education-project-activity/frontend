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
import {Reactions} from '../../widgets/reactions/reactions';
import {CommentSection} from '../../widgets/comment-section/comment-section';

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
    Reactions,
    CommentSection
  ],
  templateUrl: './topic-page.html',
  styleUrl: './topic-page.scss',
})
export class TopicPage {
  private readonly topicApi = inject(Topic);
  private readonly subscriptionApi = inject(Subscription);
  private readonly auth = inject(Auth);
  private readonly location = inject(Location);
  topic!: TopicDetailInterface;
  id = signal<string>("default");
  isYourTopic = signal<boolean>(false);
  isSubscribed = signal<boolean>(false);
  isSubscriptionLoading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
  ) {
    this.id.set(this.route.snapshot.paramMap.get('id') || "default");

    if (this.id() == "default") {
      this.location.back();
    } else {
      this.topicApi.getTopic(this.id())
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
              return this.topicApi.deleteTopic(this.id()).pipe(
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

  toggleSubscription() {
    const topicId = this.id();
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
    const topicId = this.id();
    if (!topicId) {
      return;
    }

    this.subscriptionApi.getTopicStatus(topicId)
      .subscribe(val => {
        this.isSubscribed.set(val.subscribed);
      });
  }
}
