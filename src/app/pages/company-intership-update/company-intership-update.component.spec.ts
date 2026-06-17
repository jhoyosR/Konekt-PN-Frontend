import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyIntershipUpdateComponent } from './company-intership-update.component';

describe('CompanyIntershipUpdateComponent', () => {
  let component: CompanyIntershipUpdateComponent;
  let fixture: ComponentFixture<CompanyIntershipUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyIntershipUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyIntershipUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
