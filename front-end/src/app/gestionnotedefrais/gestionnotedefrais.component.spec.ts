import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnotedefraisComponent } from './gestionnotedefrais.component';

describe('GestionnotedefraisComponent', () => {
  let component: GestionnotedefraisComponent;
  let fixture: ComponentFixture<GestionnotedefraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionnotedefraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionnotedefraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
