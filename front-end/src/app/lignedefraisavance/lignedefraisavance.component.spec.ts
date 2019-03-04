import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LignedefraisavanceComponent } from './lignedefraisavance.component';

describe('LignedefraisavanceComponent', () => {
  let component: LignedefraisavanceComponent;
  let fixture: ComponentFixture<LignedefraisavanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LignedefraisavanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LignedefraisavanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
