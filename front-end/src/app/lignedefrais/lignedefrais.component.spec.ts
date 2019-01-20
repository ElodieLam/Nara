import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LignedefraisComponent } from './lignedefrais.component';

describe('LignedefraisComponent', () => {
  let component: LignedefraisComponent;
  let fixture: ComponentFixture<LignedefraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LignedefraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LignedefraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
