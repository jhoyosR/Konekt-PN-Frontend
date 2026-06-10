import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityDashboardComponent } from './university-dashboard.component';

describe('UniversityDashboardComponent', () => {
  let component: UniversityDashboardComponent;
  let fixture: ComponentFixture<UniversityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
