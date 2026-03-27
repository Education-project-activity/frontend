import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reactions } from './reactions';

describe('Reactions', () => {
  let component: Reactions;
  let fixture: ComponentFixture<Reactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
