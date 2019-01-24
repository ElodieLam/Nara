import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquecongeComponent } from './historiqueconge.component';

describe('HistoriquecongeComponent', () => {
  let component: HistoriquecongeComponent;
  let fixture: ComponentFixture<HistoriquecongeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriquecongeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriquecongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
