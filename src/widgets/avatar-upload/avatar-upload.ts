import {Component, DestroyRef, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {
  TuiFile,
  TuiFileLike,
  TuiFilesComponent,
  TuiInputFiles,
  TuiInputFilesDirective,
} from '@taiga-ui/kit';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-avatar-upload',
  imports: [
    FormsModule,
    NgIf,
    TuiFile,
    TuiFilesComponent,
    TuiInputFiles,
    TuiInputFilesDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './avatar-upload.html',
  styleUrl: './avatar-upload.scss',
})
export class AvatarUpload {
  private readonly destroyRef = inject(DestroyRef);
  private objectUrl: string | null = null;

  @Input()
  set initialImage(value: string | null | undefined) {
    const nextValue = value ?? '';

    if (this.control.value || this.previewUrl === nextValue) {
      return;
    }

    this.revokeObjectUrl();
    this.previewUrl = nextValue;
  }

  @Output() readonly imageChange = new EventEmitter<File | null>();

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
    this.revokeObjectUrl();
    this.loadingFile = null;
    this.loadedFile = null;
    this.rejectedFile = null;
    this.previewUrl = '';
    this.control.setValue(null);
    this.imageChange.emit(null);
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
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        throw new Error('Selected file is not an image');
      }

      this.revokeObjectUrl();
      this.objectUrl = URL.createObjectURL(file);
      this.previewUrl = this.objectUrl;
      this.loadedFile = file;
      this.imageChange.emit(file);
      this.control.setErrors(null);
    } catch {
      this.revokeObjectUrl();
      this.previewUrl = '';
      this.loadedFile = null;
      this.rejectedFile = file;
      this.control.setErrors({ image: true });
    } finally {
      this.loadingFile = null;
    }
  }

  private revokeObjectUrl(): void {
    if (!this.objectUrl) {
      return;
    }

    URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null;
  }
}
