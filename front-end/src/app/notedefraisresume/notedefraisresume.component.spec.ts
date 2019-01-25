import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotedefraisresumeComponent } from './notedefraisresume.component';

describe('NotedefraisresumeComponent', () => {
  let component: NotedefraisresumeComponent;
  let fixture: ComponentFixture<NotedefraisresumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotedefraisresumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotedefraisresumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
