import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarUpload } from './avatar-upload';

describe('AvatarUpload', () => {
  let component: AvatarUpload;
  let fixture: ComponentFixture<AvatarUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
