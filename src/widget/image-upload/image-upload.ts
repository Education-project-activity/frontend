import { NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiFile, TuiFileLike, TuiFiles, TuiInputFiles } from '@taiga-ui/kit';

@Component({
  selector: 'app-image-upload',
  imports: [
    NgIf,
    ReactiveFormsModule,
    TuiFile,
    TuiFiles,
    TuiInputFiles,
  ],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
})
export class ImageUpload {
  private readonly destroyRef = inject(DestroyRef);

  @Input()
  set initialImage(value: string | null | undefined) {
    const nextValue = value ?? '';

    if (this.control.value || this.previewUrl === nextValue) {
      return;
    }

    this.previewUrl = nextValue;
  }

  @Output() readonly imageChange = new EventEmitter<string>();

  protected readonly control = new FormControl<File | null>(
    null,
    Validators.required,
  );
  protected previewUrl = '';
  protected rejectedFile: TuiFileLike | null = null;
  protected loadingFile: TuiFileLike | null = null;
  protected loadedFile: TuiFileLike | null = null;

  constructor() {
    this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((file) => {
        void this.processFile(file);
      });
  }

  protected removeFile(): void {
    this.loadingFile = null;
    this.loadedFile = null;
    this.rejectedFile = null;
    this.previewUrl = '';
    this.control.setValue(null);
    this.imageChange.emit('');
  }

  private async processFile(file: File | null): Promise<void> {
    this.rejectedFile = null;

    if (!file) {
      this.loadingFile = null;
      this.loadedFile = null;
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.loadingFile = null;
      this.loadedFile = null;
      this.rejectedFile = file;
      this.control.setErrors({ image: true });
      return;
    }

    this.loadingFile = file;
    this.loadedFile = null;

    try {
      const base64 = await this.readFileAsDataUrl(file);
      if (!base64.startsWith('data:image/')) {
        throw new Error('Selected file is not an image');
      }

      this.previewUrl = base64;
      this.loadedFile = file;
      this.imageChange.emit(base64);
      this.control.setErrors(null);
    } catch {
      this.previewUrl = '';
      this.loadedFile = null;
      this.rejectedFile = file;
      this.control.setErrors({ image: true });
    } finally {
      this.loadingFile = null;
    }
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        if (typeof result === 'string') {
          resolve(result);
          return;
        }

        reject(new Error('Failed to read file as base64 image'));
      };

      reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}
