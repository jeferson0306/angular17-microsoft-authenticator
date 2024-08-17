import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonimizacaoComponent } from './anonimizacao.component';

describe('AnonimizacaoComponent', () => {
  let component: AnonimizacaoComponent;
  let fixture: ComponentFixture<AnonimizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonimizacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnonimizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
