import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecomptaavanceComponent } from './servicecomptaavance.component';

describe('ServicecomptaavanceComponent', () => {
  let component: ServicecomptaavanceComponent;
  let fixture: ComponentFixture<ServicecomptaavanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicecomptaavanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicecomptaavanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
