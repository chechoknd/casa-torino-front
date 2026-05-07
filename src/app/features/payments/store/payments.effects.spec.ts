import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { PaymentsEffects } from './payments.effects';
import { PaymentsService } from '../../../core/services/payments.service';
import { OrdersService } from '../../../core/services/orders.service';
import { NotifierService } from '../../../core/services/notifier.service';
import { paymentsActions } from './payments.actions';
import { OrderDetail } from '../../../core/models/order.model';

describe('PaymentsEffects', () => {
  let actions$: Observable<any>;
  let effects: PaymentsEffects;
  let paymentsService: jasmine.SpyObj<PaymentsService>;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let notifier: jasmine.SpyObj<NotifierService>;

  const mockOrder: OrderDetail = {
    id: 'order-1',
    customer_id: 'cust-1',
    status: 'PENDING',
    subtotal: 150000,
    discount: 0,
    total: 150000,
    created_at: new Date().toISOString(),
    items: [],
  };

  const validPayload = {
    amount: 100000,
    method: 'CASH' as const,
    status: 'PAID' as const,
    order_id: 'order-1',
  };

  beforeEach(() => {
    paymentsService = jasmine.createSpyObj('PaymentsService', ['create']);
    ordersService = jasmine.createSpyObj('OrdersService', ['detail']);
    notifier = jasmine.createSpyObj('NotifierService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        PaymentsEffects,
        provideMockActions(() => actions$),
        { provide: PaymentsService, useValue: paymentsService },
        { provide: OrdersService, useValue: ordersService },
        { provide: NotifierService, useValue: notifier },
      ],
    });

    effects = TestBed.inject(PaymentsEffects);
  });

  describe('create$', () => {
    it('should create payment when amount is less than order total', (done) => {
      ordersService.detail.and.returnValue(of(mockOrder));
      paymentsService.create.and.returnValue(of({} as any));

      actions$ = of(paymentsActions.createPayment({ payload: validPayload }));

      effects.create$.subscribe((action) => {
        expect(action.type).toBe('[Payments] Load Payments');
        expect(ordersService.detail).toHaveBeenCalledWith('order-1');
        expect(paymentsService.create).toHaveBeenCalledWith(validPayload);
        expect(notifier.success).toHaveBeenCalledWith('Pago registrado correctamente.');
        done();
      });
    });

    it('should create payment when amount equals order total', (done) => {
      ordersService.detail.and.returnValue(of(mockOrder));
      paymentsService.create.and.returnValue(of({} as any));

      actions$ = of(paymentsActions.createPayment({ payload: { ...validPayload, amount: 150000 } }));

      effects.create$.subscribe((action) => {
        expect(action.type).toBe('[Payments] Load Payments');
        expect(paymentsService.create).toHaveBeenCalled();
        expect(notifier.success).toHaveBeenCalled();
        done();
      });
    });

    it('should reject payment when amount exceeds order total', (done) => {
      ordersService.detail.and.returnValue(of(mockOrder));

      actions$ = of(paymentsActions.createPayment({ payload: { ...validPayload, amount: 200000 } }));

      effects.create$.subscribe((action) => {
        expect(action.type).toBe('[Payments] Load Payments Failure');
        expect(paymentsService.create).not.toHaveBeenCalled();
        expect(notifier.error).toHaveBeenCalledWith(
          jasmine.stringMatching(/supera el total/)
        );
        done();
      });
    });

    it('should handle order detail fetch error', (done) => {
      ordersService.detail.and.returnValue(throwError(() => new Error('Network error')));

      actions$ = of(paymentsActions.createPayment({ payload: validPayload }));

      effects.create$.subscribe((action) => {
        expect(action.type).toBe('[Payments] Load Payments Failure');
        expect(paymentsService.create).not.toHaveBeenCalled();
        expect(notifier.error).toHaveBeenCalled();
        done();
      });
    });
  });
});
