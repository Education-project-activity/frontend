import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import { Auth } from '../../utils/api/auth';
import { Comment } from '../../utils/api/comment';
import {
  CommentPageInterface,
  CommentResponse,
  CreateCommentRequest,
} from '../../entities/comment/comment.interface';
import { ReactionSummaryInterface } from '../../entities/reaction/reaction-summary.interface';
import { TopicDetailInterface } from '../../entities/topic/topic-detail.interface';
import { Reaction } from '../../utils/api/reaction';
import { Subscription } from '../../utils/api/subscription';
import { Topic } from '../../utils/api/topic';
import { TopicPage } from './topic-page';
import { Content } from '../../widgets/content/content';

@Component({
  selector: 'app-content',
  standalone: true,
  template: '<div class="mock-content">{{ data?.blocks?.length ?? 0 }}</div>',
})
class MockContent {
  @Input() data: TopicDetailInterface['content'] | null | undefined = null;
}

describe('TopicPage', () => {
  let component: TopicPage;
  let fixture: ComponentFixture<TopicPage>;

  const mockTopic: TopicDetailInterface = {
    id: 'topic-1',
    authorId: 'author-1',
    title: 'Test Topic Title',
    description: 'Test Topic Body',
    content: {
      blocks: [
        {
          id: 'block-1',
          type: 'paragraph',
          data: { text: 'Body content' },
        },
      ],
    },
    createdAt: new Date().toISOString(),
    eventDate: new Date().toISOString(),
    authorName: 'First Last',
    imageUrl: 'test-image.jpg',
    priority: false,
    tags: ['news'],
  };

  const mockReactionSummary: ReactionSummaryInterface = {
    counts: {
      LIKE: 2,
      LOVE: 1,
      LAUGH: 0,
      WOW: 0,
    },
    currentUserReaction: 'LIKE',
  };

  const nestedComment: CommentResponse = {
    id: 'comment-1',
    topic_id: 'topic-1',
    parent_id: null,
    author: {
      id: 'user-1',
      email: 'first@example.com',
      first_name: 'Ivan',
      last_name: 'Ivanov',
      position: 'Author',
      department: 'Editorial',
    },
    content: 'Top level comment',
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    replies: [
      {
        id: 'comment-2',
        topic_id: 'topic-1',
        parent_id: 'comment-1',
        author: {
          id: 'user-2',
          email: 'second@example.com',
          first_name: 'Petr',
          last_name: 'Petrov',
          position: 'Reader',
          department: 'Community',
        },
        content: 'Nested reply',
        metadata: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        replies: [],
      },
    ],
  };

  const mockCommentsPage: CommentPageInterface = {
    content: [nestedComment],
  };

  const routeMock = {
    snapshot: {
      paramMap: convertToParamMap({ id: 'topic-1' }),
    },
  };

  const topicApiMock = {
    getTopic: vi.fn(),
    deleteTopic: vi.fn(),
  };

  const reactionApiMock = {
    getForTopic: vi.fn(),
    reactToTopic: vi.fn(),
    removeFromTopic: vi.fn(),
  };

  const commentApiMock = {
    getByTopic: vi.fn(),
    create: vi.fn(),
  };

  const subscriptionApiMock = {
    getTopicStatus: vi.fn(),
    subscribeToTopic: vi.fn(),
    unsubscribeFromTopic: vi.fn(),
  };

  const authMock = {
    userId: 'author-1',
  };

  const locationMock = {
    back: vi.fn(),
  };

  const alertServiceMock = {
    open: vi.fn(() => of(false)),
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(TopicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    topicApiMock.getTopic.mockReset();
    topicApiMock.deleteTopic.mockReset();
    reactionApiMock.getForTopic.mockReset();
    reactionApiMock.reactToTopic.mockReset();
    reactionApiMock.removeFromTopic.mockReset();
    commentApiMock.getByTopic.mockReset();
    commentApiMock.create.mockReset();
    subscriptionApiMock.getTopicStatus.mockReset();
    subscriptionApiMock.subscribeToTopic.mockReset();
    subscriptionApiMock.unsubscribeFromTopic.mockReset();
    locationMock.back.mockReset();
    alertServiceMock.open.mockClear();
    authMock.userId = 'author-1';

    TestBed.configureTestingModule({
      imports: [TopicPage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: Topic, useValue: topicApiMock },
        { provide: Reaction, useValue: reactionApiMock },
        { provide: Comment, useValue: commentApiMock },
        { provide: Subscription, useValue: subscriptionApiMock },
        { provide: Auth, useValue: authMock },
        { provide: Location, useValue: locationMock },
        { provide: TuiAlertService, useValue: alertServiceMock },
      ],
    });

    TestBed.overrideComponent(TopicPage, {
      remove: { imports: [Content] },
      add: { imports: [MockContent] },
    });

    await TestBed.compileComponents();
  });

  it('should create', () => {
    topicApiMock.getTopic.mockReturnValue(of(mockTopic));
    reactionApiMock.getForTopic.mockReturnValue(of(mockReactionSummary));
    commentApiMock.getByTopic.mockReturnValue(of(mockCommentsPage));
    subscriptionApiMock.getTopicStatus.mockReturnValue(of({ subscribed: true }));

    createComponent();

    expect(component).toBeTruthy();
  });

  it('should load and render topic data for the author', () => {
    topicApiMock.getTopic.mockReturnValue(of(mockTopic));
    reactionApiMock.getForTopic.mockReturnValue(of(mockReactionSummary));
    commentApiMock.getByTopic.mockReturnValue(of(mockCommentsPage));
    subscriptionApiMock.getTopicStatus.mockReturnValue(of({ subscribed: true }));

    createComponent();

    expect(topicApiMock.getTopic).toHaveBeenCalledWith('topic-1');
    expect(reactionApiMock.getForTopic).toHaveBeenCalledWith('topic-1');
    expect(commentApiMock.getByTopic).toHaveBeenCalledWith('topic-1');
    expect(subscriptionApiMock.getTopicStatus).toHaveBeenCalledWith('topic-1');
    expect(component.topic).toEqual(mockTopic);
    expect(component.isYourTopic()).toBe(true);
    expect(component.isSubscribed()).toBe(true);
    expect(component.comments()).toEqual([
      { comment: nestedComment, depth: 0 },
      { comment: nestedComment.replies[0], depth: 1 },
    ]);

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('.author-name')?.textContent).toContain(mockTopic.authorName);
    expect(host.querySelector('.h2')?.textContent).toContain(mockTopic.title);
    expect(host.querySelector('.mock-content')?.textContent).toContain('1');
    expect(host.textContent).toContain('Редактировать');
    expect(host.textContent).toContain('Удалить');
    expect(host.querySelectorAll('.comment-text').length).toBe(2);
    expect(
      Array.from(host.querySelectorAll('.reaction-count')).map(node => node.textContent?.trim())
    ).toEqual(['1', '2']);
  });

  it('should render subscribe button for чужой topic', () => {
    authMock.userId = 'another-user';
    topicApiMock.getTopic.mockReturnValue(of(mockTopic));
    reactionApiMock.getForTopic.mockReturnValue(of(mockReactionSummary));
    commentApiMock.getByTopic.mockReturnValue(of(mockCommentsPage));
    subscriptionApiMock.getTopicStatus.mockReturnValue(of({ subscribed: false }));

    createComponent();

    const host: HTMLElement = fixture.nativeElement;
    expect(component.isYourTopic()).toBe(false);
    expect(host.textContent).toContain('Подписаться');
    expect(host.textContent).not.toContain('Редактировать');
  });

  it('should submit a comment and reload the list', () => {
    const updatedCommentsPage: CommentPageInterface = {
      content: [
        nestedComment,
        {
          ...nestedComment,
          id: 'comment-3',
          content: 'Fresh comment',
          replies: [],
        },
      ],
    };

    topicApiMock.getTopic.mockReturnValue(of(mockTopic));
    reactionApiMock.getForTopic.mockReturnValue(of(mockReactionSummary));
    commentApiMock.getByTopic
      .mockReturnValueOnce(of(mockCommentsPage))
      .mockReturnValueOnce(of(updatedCommentsPage));
    commentApiMock.create.mockReturnValue(of({}));
    subscriptionApiMock.getTopicStatus.mockReturnValue(of({ subscribed: false }));

    createComponent();

    component.commentText.set('  New comment  ');
    component.submitComment();
    fixture.detectChanges();

    expect(commentApiMock.create).toHaveBeenCalledWith({
      topic_id: 'topic-1',
      parent_id: null,
      content: 'New comment',
    } satisfies CreateCommentRequest);
    expect(commentApiMock.getByTopic).toHaveBeenCalledTimes(2);
    expect(component.commentText()).toBe('');
    expect(component.comments()).toHaveLength(3);
  });

  it('should toggle subscription state after subscribe', () => {
    topicApiMock.getTopic.mockReturnValue(of(mockTopic));
    reactionApiMock.getForTopic.mockReturnValue(of(mockReactionSummary));
    commentApiMock.getByTopic.mockReturnValue(of(mockCommentsPage));
    subscriptionApiMock.getTopicStatus
      .mockReturnValueOnce(of({ subscribed: false }))
      .mockReturnValueOnce(of({ subscribed: true }));
    subscriptionApiMock.subscribeToTopic.mockReturnValue(of({}));

    createComponent();

    component.toggleSubscription();
    fixture.detectChanges();

    expect(subscriptionApiMock.subscribeToTopic).toHaveBeenCalledWith('topic-1');
    expect(subscriptionApiMock.unsubscribeFromTopic).not.toHaveBeenCalled();
    expect(component.isSubscribed()).toBe(true);
    expect(component.isSubscriptionLoading()).toBe(false);
  });
});
