import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestiondemandeComponent } from './gestiondemande.component';

describe('GestiondemandeComponent', () => {
  let component: GestiondemandeComponent;
  let fixture: ComponentFixture<GestiondemandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestiondemandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestiondemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
