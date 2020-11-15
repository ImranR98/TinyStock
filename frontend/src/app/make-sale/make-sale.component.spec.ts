import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeSaleComponent } from './make-sale.component';

describe('MakeSaleComponent', () => {
  let component: MakeSaleComponent;
  let fixture: ComponentFixture<MakeSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
