import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityPartnershipComponent } from './university-partnership.component';

describe('UniversityPartnershipComponent', () => {
  let component: UniversityPartnershipComponent;
  let fixture: ComponentFixture<UniversityPartnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityPartnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
