import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PaymentFormComponent } from './payment-form.component';
import { selectAllOrders } from '../../../orders/store/orders.selectors';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PaymentFormComponent', () => {
  let component: PaymentFormComponent;
  let fixture: ComponentFixture<PaymentFormComponent>;
  let store: MockStore;

  const mockOrders = [
    { id: 'order-1', total: 150000 },
    { id: 'order-2', total: 250000 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PaymentFormComponent,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [{ selector: selectAllOrders, value: mockOrders }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('amount validation', () => {
    function setAmount(value: number): void {
      (component as any).form.controls.amount.setValue(value);
      (component as any).form.controls.amount.updateValueAndValidity();
    }

    it('should block amount greater than order total', () => {
      (component as any).orderId = 'order-1';
      (component as any).ngOnInit();
      setAmount(200000);
      expect((component as any).form.controls.amount.hasError('max')).toBeTrue();
    });

    it('should allow amount equal to order total', () => {
      (component as any).orderId = 'order-1';
      (component as any).ngOnInit();
      setAmount(150000);
      expect((component as any).form.controls.amount.hasError('max')).toBeFalse();
    });

    it('should allow amount less than order total', () => {
      (component as any).orderId = 'order-1';
      (component as any).ngOnInit();
      setAmount(75000);
      expect((component as any).form.controls.amount.hasError('max')).toBeFalse();
    });
  });
});
