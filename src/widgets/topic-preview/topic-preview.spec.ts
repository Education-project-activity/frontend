import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicPreview } from './topic-preview';
import { TopicPreviewInterface } from '../../entities/topic/topic-preview.interface';
import { User } from '../../utils/api/user';
import { provideRouter } from '@angular/router';

describe('TopicPreview', () => {
  let component: TopicPreview;
  let fixture: ComponentFixture<TopicPreview>;

  const mockTopic: TopicPreviewInterface = {
    id: 'author123',
    title: 'Test Topic Title',
    authorName: 'Test Author',
    description: 'Test Topic Body',
    createdAt: new Date().toISOString(),
    imageUrl: 'test-image.jpg',
    priority: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicPreview],
      providers: [provideRouter([]), { provide: User }],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicPreview);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('topic', mockTopic);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render the data according to the input', () => {
    fixture.componentRef.setInput('topic', mockTopic);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('.author-name')?.textContent).toContain(mockTopic.authorName);
    expect(host.querySelector('.h4')?.textContent).toContain(mockTopic.title);
    //expect(host.querySelector('.description')?.textContent).toContain(mockTopic.description);
  });

  it('should show priority icon only for priority topics', () => {
    fixture.componentRef.setInput('topic', { ...mockTopic, priority: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tui-icon')).toBeNull();

    fixture.componentRef.setInput('topic', { ...mockTopic, priority: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tui-icon')).toBeTruthy();
  });
});
