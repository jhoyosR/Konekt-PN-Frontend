import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInternshipComponent } from './company-internship.component';

describe('CompanyInternshipComponent', () => {
  let component: CompanyInternshipComponent;
  let fixture: ComponentFixture<CompanyInternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyInternshipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyInternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
