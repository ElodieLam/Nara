import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecomptaComponent } from './servicecompta.component';

describe('ServicecomptaComponent', () => {
  let component: ServicecomptaComponent;
  let fixture: ComponentFixture<ServicecomptaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicecomptaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicecomptaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
