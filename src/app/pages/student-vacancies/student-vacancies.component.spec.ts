import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentVacanciesComponent } from './student-vacancies.component';

describe('StudentVacanciesComponent', () => {
  let component: StudentVacanciesComponent;
  let fixture: ComponentFixture<StudentVacanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentVacanciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentVacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
