import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPartnershipComponent } from './admin-partnership.component';

describe('AdminPartnershipComponent', () => {
  let component: AdminPartnershipComponent;
  let fixture: ComponentFixture<AdminPartnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPartnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
