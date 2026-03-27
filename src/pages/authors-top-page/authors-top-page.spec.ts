import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsTopPage } from './authors-top-page';

describe('AuthorsTopPage', () => {
  let component: AuthorsTopPage;
  let fixture: ComponentFixture<AuthorsTopPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorsTopPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorsTopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
