import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Notif_ServiceComponent } from './notif-service.component';

describe('NotifComponent', () => {
  let component: Notif_ServiceComponent;
  let fixture: ComponentFixture<Notif_ServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Notif_ServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Notif_ServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
