import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotedefraisComponent } from './notedefrais.component';

describe('NotedefraisComponent', () => {
  let component: NotedefraisComponent;
  let fixture: ComponentFixture<NotedefraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotedefraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotedefraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
