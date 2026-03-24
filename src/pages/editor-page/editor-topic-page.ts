import {Component, ViewChild, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiTextfield, TuiButton, TuiAlertService, TuiDialog} from '@taiga-ui/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiInputChip} from '@taiga-ui/kit';
import {TuiDay, TuiTime} from '@taiga-ui/cdk/date-time';
import {Editor} from '../../widgets/editor/editor';
import {TopicUpsertInterface} from '../../entities/topic/topic-upsert.interface';
import {Topic} from '../../utils/api/topic';
import {OutputData} from '@editorjs/editorjs';
import {Auth} from '../../utils/api/auth';
import {UserInfoInterface} from '../../entities/user/user-info.interface';
import {User} from '../../utils/api/user';
import {ImageUpload} from '../../widgets/image-upload/image-upload';

@Component({
  selector: 'app-editor-page',
  imports: [
    TuiTextfield,
    ReactiveFormsModule,
    TuiButton,
    Editor,
    TuiDialog,
    TuiInputChip,
    FormsModule,
    ImageUpload,
  ],
  templateUrl: './editor-topic-page.html',
  styleUrl: './editor-topic-page.scss',
})
export class EditorTopicPage {
  @ViewChild(Editor) editorComponent!: Editor;

  private readonly topicApi = inject(Topic);
  private readonly userApi = inject(User);
  private readonly route = inject(ActivatedRoute);
  private readonly alerts = inject(TuiAlertService);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  isSubmitting = false;
  isEditMode = false;
  topicId: string | null = null;
  isEditorReady = false;
  editorData: OutputData | null = null;
  isMetaStepOpen= signal<boolean>(false);
  tags: string[] = [];
  author: UserInfoInterface | null = null;

  protected topicForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    tags: new FormControl('', Validators.required),
    priority: new FormControl(false, {nonNullable: true}),
  });

  constructor() {
    const authorId = this.auth.userId;
    if (authorId) {
      this.userApi.getUserByID(authorId)
        .subscribe(user => {
          this.author = user;
        })
    }

    this.topicId = this.route.snapshot.paramMap.get('id');
    if (this.topicId) {
      this.isEditMode = true;
      this.loadTopic(this.topicId);
    } else {
      this.isEditorReady = true;
    }
  }

  async openMetaStep() {
    const {title} = this.topicForm.controls;

    if (title.invalid) {
      if (title.invalid) {
        this.alerts
          .open('Добавьте текст для заголовка', {
            label: 'Заголовок',
            appearance: 'warning',
          })
          .subscribe();
        return;
      }
      return;
    }

    const content = await this.editorComponent?.getData();
    if (!content || content?.blocks.length == 0) {
      this.alerts
        .open('Добавьте контент в редактор', {
          label: 'Редактор пуст',
          appearance: 'warning',
        })
        .subscribe();
      return;
    }

    this.topicForm.controls.description.setValue(this.buildDescription(content));
    this.isMetaStepOpen.set(true);
  }

  async onSubmit(): Promise<void> {
    if (!this.isMetaStepOpen()) {
      this.openMetaStep();
      return;
    }

    const content = await this.editorComponent?.getData();

    if (!content) return;
    if (content.blocks.length == 0) {
      this.alerts
        .open('Добавьте контент в редактор', {
          label: 'Редактор пуст',
          appearance: 'warning',
        })
        .subscribe();
      return;
    }

    this.topicForm.controls.description.setValue(this.buildDescription(content));

    if (this.topicForm.invalid) {
      this.topicForm.markAllAsTouched();
      return;
    }

    if (this.topicForm.controls.title.invalid) {
      this.alerts
        .open('Добавьте текст для заголовка', {
          label: 'Заголовок',
          appearance: 'warning',
        })
        .subscribe();
      return;
    }

    if (this.tags.length === 0) {
      this.alerts
        .open('Добавьте хотя бы один тег', {
          label: 'Теги',
          appearance: 'warning',
        })
        .subscribe();
      return;
    }

    const payload = this.buildPayload(content);
    this.isSubmitting = true;

    const request = this.isEditMode && this.topicId
      ? this.topicApi.updateTopic(this.topicId, payload)
      : this.topicApi.createTopic(payload);

    request.subscribe({
      next: topic => {
        this.isSubmitting = false;
        this.alerts
          .open(this.isEditMode ? 'Тема обновлена' : 'Тема опубликована', {
            label: this.isEditMode ? 'Сохранено' : 'Успех',
            appearance: 'success',
          })
          .subscribe();

        if (topic?.id) {
          this.router.navigate(['/topic', topic.id]);
        }
      },
      error: err => {
        this.isSubmitting = false;
        this.alerts
          .open('Не удалось сохранить тему', {
            label: 'Ошибка',
            appearance: 'negative',
          })
          .subscribe();
      },
    });
  }

  protected onTagsChange(tags: string[]) {
    this.tags = tags;
    this.topicForm.controls.tags.setValue(tags.join(','));
  }

  protected onImageChange(imageBase64: string): void {
    this.topicForm.controls.image.setValue(imageBase64);
    this.topicForm.controls.image.markAsDirty();
    this.topicForm.controls.image.updateValueAndValidity();
  }

  private buildPayload(content: OutputData): TopicUpsertInterface {
    const {title, description, image, priority} =
      this.topicForm.getRawValue();

    const normalizedImage = image?.trim() ?? '';

    const payload: TopicUpsertInterface = {
      title: title ?? '',
      description: description ?? '',
      content,
      priority: priority,
      tags: this.tags,
    };

    if (normalizedImage.startsWith('data:image/')) {
      payload.imageBase64 = normalizedImage;
    } else if (normalizedImage) {
      payload.imageUrl = normalizedImage;
    }

    return payload;
  }

  private toLocalDateTimeValue(date: Date): readonly [TuiDay, TuiTime] {
    return [TuiDay.fromLocalNativeDate(date), TuiTime.fromLocalNativeDate(date)];
  }

  private normalizeEventDate(
    eventDate: readonly [TuiDay, TuiTime | null] | null | undefined
  ): string {
    if (!eventDate) {
      return '';
    }

    const [day, time] = eventDate;
    const timeValue = time?.toString('HH:MM') ?? '00:00';
    return `${day.toJSON()}T${timeValue}:00`;
  }

  private buildDescription(content: OutputData): string {
    const parts: string[] = [];

    for (const block of content.blocks ?? []) {
      const data = block.data as {
        text?: string;
        caption?: string;
        items?: string[];
        message?: string;
        title?: string;
      };

      if (data?.text) {
        parts.push(data.text);
      }
      if (data?.items?.length) {
        parts.push(data.items.join(' '));
      }
      if (data?.caption) {
        parts.push(data.caption);
      }
      if (data?.message) {
        parts.push(data.message);
      }
      if (data?.title) {
        parts.push(data.title);
      }
    }

    const plain = parts
      .join(' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return plain.slice(0, 500);
  }

  private loadTopic(id: string): void {
    this.topicApi.getTopic(id).subscribe({
      next: topic => {
        this.topicForm.controls.title.setValue(topic.title ?? '');
        this.topicForm.controls.description.setValue(topic.description ?? '');
        this.topicForm.controls.image.setValue(topic.imageUrl ?? '');
        this.topicForm.controls.priority.setValue(topic.priority);
        this.onTagsChange(topic.tags ?? []);
        const content = topic.content as OutputData | null;
        this.editorData = content && Array.isArray(content.blocks) ? content : {blocks: []};
        this.isEditorReady = true;
      },
      error: () => {
        this.alerts
          .open('Не удалось загрузить тему', {
            label: 'Ошибка',
            appearance: 'negative',
          })
          .subscribe();
        this.router.navigate(['/']);
      },
    });
  }
}
