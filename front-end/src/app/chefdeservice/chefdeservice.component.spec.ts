import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefdeserviceComponent } from './chefdeservice.component';

describe('ChefdeserviceComponent', () => {
  let component: ChefdeserviceComponent;
  let fixture: ComponentFixture<ChefdeserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChefdeserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChefdeserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
