import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecomptandfComponent } from './servicecomptandf.component';

describe('ServicecomptandfComponent', () => {
  let component: ServicecomptandfComponent;
  let fixture: ComponentFixture<ServicecomptandfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicecomptandfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicecomptandfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
