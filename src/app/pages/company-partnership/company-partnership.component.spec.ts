import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPartnershipComponent } from './company-partnership.component';

describe('CompanyPartnershipComponent', () => {
  let component: CompanyPartnershipComponent;
  let fixture: ComponentFixture<CompanyPartnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyPartnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
