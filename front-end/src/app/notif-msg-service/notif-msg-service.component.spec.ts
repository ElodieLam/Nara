import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifMsgServiceComponent } from './notif-msg-service.component';

describe('NotifMsgServiceComponent', () => {
  let component: NotifMsgServiceComponent;
  let fixture: ComponentFixture<NotifMsgServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifMsgServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifMsgServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
