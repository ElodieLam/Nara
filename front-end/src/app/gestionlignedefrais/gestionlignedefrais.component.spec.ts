import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionlignedefraisComponent } from './gestionlignedefrais.component';

describe('GestionlignedefraisComponent', () => {
  let component: GestionlignedefraisComponent;
  let fixture: ComponentFixture<GestionlignedefraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionlignedefraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionlignedefraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
