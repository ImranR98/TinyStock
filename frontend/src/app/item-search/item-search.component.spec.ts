import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSearchComponent } from './item-search.component';

describe('ItemSearchComponent', () => {
  let component: ItemSearchComponent;
  let fixture: ComponentFixture<ItemSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
