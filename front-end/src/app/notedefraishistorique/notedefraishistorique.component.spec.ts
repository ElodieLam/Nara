import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotedefraishistoriqueComponent } from './notedefraishistorique.component';

describe('NotedefraishistoriqueComponent', () => {
  let component: NotedefraishistoriqueComponent;
  let fixture: ComponentFixture<NotedefraishistoriqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotedefraishistoriqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotedefraishistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
