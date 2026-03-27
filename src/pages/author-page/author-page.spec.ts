import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { AuthorPage } from './author-page';
import { UserInfoInterface } from '../../entities/user/user-info.interface';
import { TopicPreviewInterface } from '../../entities/topic/topic-preview.interface';
import { User } from '../../utils/api/user';
import { Topic } from '../../utils/api/topic';

describe('AuthorPage', () => {
  let component: AuthorPage;
  let fixture: ComponentFixture<AuthorPage>;

  const mockAuthorInfo: UserInfoInterface = {
    id: 'author123',
    firstName: 'First',
    lastName: 'Last',
    email: 'test@example.com',
    position: 'Author',
    department: 'Editorial',
  };

  const mockTopics: TopicPreviewInterface[] = [
    {
      id: 'topic-1',
      title: 'Test Topic Title',
      authorName: 'First Last',
      description: 'Test Topic Body',
      createdAt: new Date().toISOString(),
      imageUrl: 'test-image.jpg',
      priority: false,
    },
  ];

  const routeMock = {
    snapshot: {
      paramMap: convertToParamMap({ id: 'author123' }),
    },
  };

  const userApiMock = {
    getUserByID: vi.fn(),
  };

  const topicApiMock = {
    getTopicsByAuthor: vi.fn(),
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(AuthorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    userApiMock.getUserByID.mockReset();
    topicApiMock.getTopicsByAuthor.mockReset();

    await TestBed.configureTestingModule({
      imports: [AuthorPage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: User, useValue: userApiMock },
        { provide: Topic, useValue: topicApiMock },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    userApiMock.getUserByID.mockReturnValue(of(mockAuthorInfo));
    topicApiMock.getTopicsByAuthor.mockReturnValue(of(mockTopics));

    createComponent();

    expect(component).toBeTruthy();
  });

  it('should load and render author data with topics', () => {
    userApiMock.getUserByID.mockReturnValue(of(mockAuthorInfo));
    topicApiMock.getTopicsByAuthor.mockReturnValue(of(mockTopics));

    createComponent();

    expect(userApiMock.getUserByID).toHaveBeenCalledWith('author123');
    expect(topicApiMock.getTopicsByAuthor).toHaveBeenCalledWith('author123');
    expect(component.author).toEqual(mockAuthorInfo);
    expect(component.topics).toEqual(mockTopics);
    expect(component.isLoading).toBe(false);

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('.author-name')?.textContent).toContain('First Last');
    expect(host.querySelectorAll('app-topic-preview').length).toBe(1);
    expect(host.querySelector('.empty-title')).toBeNull();
  });

  it('should show empty state when loading author page fails', () => {
    userApiMock.getUserByID.mockReturnValue(throwError(() => new Error('failed')));
    topicApiMock.getTopicsByAuthor.mockReturnValue(of(mockTopics));

    createComponent();

    expect(component.author).toBeNull();
    expect(component.topics).toEqual([]);
    expect(component.isLoading).toBe(false);

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('.author-card')).toBeNull();
    expect(host.querySelector('.empty-title')?.textContent).toContain('Пока нет публикаций');
  });
});
