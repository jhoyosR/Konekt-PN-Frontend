import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSkillComponent } from './student-skill.component';

describe('StudentSkillComponent', () => {
  let component: StudentSkillComponent;
  let fixture: ComponentFixture<StudentSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSkillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
