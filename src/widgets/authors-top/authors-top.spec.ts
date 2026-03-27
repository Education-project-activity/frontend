import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsTop } from './authors-top';

describe('AuthorsTop', () => {
  let component: AuthorsTop;
  let fixture: ComponentFixture<AuthorsTop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorsTop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorsTop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
