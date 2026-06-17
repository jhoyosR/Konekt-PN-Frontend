import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityIntershipComponent } from './university-intership.component';

describe('UniversityIntershipComponent', () => {
  let component: UniversityIntershipComponent;
  let fixture: ComponentFixture<UniversityIntershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityIntershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityIntershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
