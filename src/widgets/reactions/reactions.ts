import {Component, inject, Input, signal} from '@angular/core';
import {ReactionSummaryInterface, ReactionType} from '../../entities/reaction/reaction-summary.interface';
import {catchError, EMPTY, switchMap} from 'rxjs';
import {Reaction} from '../../utils/api/reaction';
import {Location} from '@angular/common';
import {TuiButton, TuiIcon} from '@taiga-ui/core';
import {TuiItemGroup} from '@taiga-ui/layout';
import {TuiChip} from '@taiga-ui/kit';

@Component({
  selector: 'app-reactions',
  imports: [
    TuiButton,
    TuiIcon,
    TuiItemGroup,
    TuiChip
  ],
  templateUrl: './reactions.html',
  styleUrl: './reactions.scss',
})
export class Reactions {
  @Input() topicId: string | null = null;
  private readonly reactionApi = inject(Reaction);
  private readonly location = inject(Location);

  reactionSummary = signal<ReactionSummaryInterface | null>(null);
  isReactionPickerOpen = signal<boolean>(false);

  readonly reactionTypes: {type: ReactionType; emoji: string; label: string}[] = [
    {type: 'LOVE', emoji: 'heart', label: 'Любовь'},
    //{type: 'DISLIKE', emoji: 'thumbs-down', label: 'Не нравится'},
    {type: 'LIKE', emoji: 'thumbs-up', label: 'Нравится'},
    {type: 'LAUGH', emoji: 'smile', label: 'Смешно'},
    {type: 'WOW', emoji: 'party-popper', label: 'Ого'}
  ];

  ngOnInit() {
    this.loadReactions();
  }

  toggleReactionPicker() {
    this.isReactionPickerOpen.set(!this.isReactionPickerOpen());
  }

  reactToTopic(type: ReactionType) {
    const topicId = this.topicId;
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
    const topicId = this.topicId;
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
}
