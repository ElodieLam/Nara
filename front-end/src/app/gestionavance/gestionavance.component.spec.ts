import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionavanceComponent } from './gestionavance.component';

describe('GestionavanceComponent', () => {
  let component: GestionavanceComponent;
  let fixture: ComponentFixture<GestionavanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionavanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionavanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
