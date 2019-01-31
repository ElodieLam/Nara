import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDemandecongeComponent } from './create-demandeconge.component';

describe('CreateDemandecongeComponent', () => {
  let component: CreateDemandecongeComponent;
  let fixture: ComponentFixture<CreateDemandecongeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDemandecongeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDemandecongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
