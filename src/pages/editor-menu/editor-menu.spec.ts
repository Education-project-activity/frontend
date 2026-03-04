import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorMenu } from './editor-menu';

describe('EditorMenu', () => {
  let component: EditorMenu;
  let fixture: ComponentFixture<EditorMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
