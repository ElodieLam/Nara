import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifMsgComponent } from './notif-msg.component';

describe('NotifMsgComponent', () => {
  let component: NotifMsgComponent;
  let fixture: ComponentFixture<NotifMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
