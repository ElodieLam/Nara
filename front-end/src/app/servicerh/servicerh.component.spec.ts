import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicerhComponent } from './servicerh.component';

describe('ServicerhComponent', () => {
  let component: ServicerhComponent;
  let fixture: ComponentFixture<ServicerhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicerhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicerhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
