import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySkillsComponent } from './company-skills.component';

describe('CompanySkillsComponent', () => {
  let component: CompanySkillsComponent;
  let fixture: ComponentFixture<CompanySkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySkillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
