import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { OrderDetail } from '../../../../core/models/order.model';
import { InvoiceService } from '../../services/invoice.service';
import { ordersActions } from '../../store/orders.actions';
import { selectSelectedOrder } from '../../store/orders.selectors';

@Component({
  selector: 'ct-order-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatSelectModule, CurrencyCopPipe],
  template: `
    <div class="page-shell" *ngIf="order$ | async as order">
      <mat-card class="page-card detail-card">
        <h1>Orden {{ order.order_label ?? 'Sin consecutivo' }}</h1>
        <p>Cliente: {{ order.customer_name ?? 'Sin nombre' }}</p>
        <p>Subtotal: {{ order.subtotal | currencyCop }}</p>
        <p>Descuento: {{ order.discount | currencyCop }}</p>
        <p>Total: {{ order.total | currencyCop }}</p>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [value]="order.status" (valueChange)="changeStatus(order.id, $event)">
            <mat-option *ngFor="let status of statuses" [value]="status">{{ status }}</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="actions">
          <button mat-stroked-button (click)="viewInvoice(order)">
            <mat-icon>visibility</mat-icon>
            Ver Factura
          </button>
          <button mat-raised-button color="primary" (click)="downloadInvoice(order)">
            <mat-icon>download</mat-icon>
            Descargar Factura
          </button>
          <a mat-stroked-button [routerLink]="['/payments']" [queryParams]="{ orderId: order.id }">Ver pagos</a>
        </div>
      </mat-card>

      <mat-card class="page-card detail-card">
        <h2>Ítems</h2>
        <div class="row" *ngFor="let item of order.items">
          <span>{{ item.product_name ?? 'Sin nombre' }}</span>
          <span>{{ item.quantity }}</span>
          <span>{{ item.subtotal ?? item.total ?? 0 | currencyCop }}</span>
        </div>
      </mat-card>

      <mat-card class="page-card detail-card">
        <h2>Historial de estado</h2>
        <div class="row" *ngFor="let status of order.status_history ?? []">
          <span>{{ status.status }}</span>
          <span>{{ status.changed_at | date: 'short' }}</span>
        </div>
      </mat-card>
    </div>
  `,
  styles: `
    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .actions button mat-icon,
    .actions a mat-icon {
      margin-right: 4px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly invoiceService = inject(InvoiceService);
  protected readonly order$ = this.store.select(selectSelectedOrder);
  protected readonly statuses = ['PENDING', 'CONFIRMED', 'IN_PREPARATION', 'READY', 'DELIVERED', 'CANCELLED'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(ordersActions.loadOrderDetail({ id }));
    }
  }

  protected changeStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED'): void {
    this.store.dispatch(ordersActions.updateOrderStatus({ id, status }));
    this.store.dispatch(ordersActions.loadOrderDetail({ id }));
  }

  protected viewInvoice(order: OrderDetail): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = this.buildInvoiceHtml(order);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  protected downloadInvoice(order: OrderDetail): void {
    void this.invoiceService.downloadInvoice(order);
  }

  private buildInvoiceHtml(order: OrderDetail): string {
    const format = (n: number) =>
      new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    const orderNumber = escapeHtml(`${order.order_label ?? order.order_number ?? order.id}`);
    const logoUrl = new URL('assets/images/casa_torino_logo.jpg', document.baseURI).href;

    const itemsRows = order.items
      .map(
        item => {
          const lineTotal = item.subtotal ?? item.total ?? 0;
          const unitPrice = item.unit_price ?? (item.quantity ? lineTotal / item.quantity : 0);

          return `
            <div class="item-row">
              <div>
                <p>${escapeHtml(item.product_name ?? 'Producto sin nombre')}</p>
                <small>Cantidad: ${item.quantity} · Unitario: ${format(unitPrice)}</small>
              </div>
              <strong>${format(lineTotal)}</strong>
            </div>`;
        }
      )
      .join('');

    const discountRow = order.discount
      ? `<div class="totals-row discount"><span>Descuento</span><span>-${format(order.discount)}</span></div>`
      : '';

    return `
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: #f3eee5;
            color: #182b0e;
            font-family: 'DM Sans', 'Nunito', 'Outfit', Arial, sans-serif;
          }
          .invoice {
            position: relative;
            width: 794px;
            min-height: 1123px;
            overflow: hidden;
            background:
              linear-gradient(135deg, rgba(255, 253, 248, 0.98) 0%, rgba(250, 246, 238, 0.98) 46%, rgba(232, 224, 207, 0.94) 100%),
              #fffdf8;
            border: 8px solid #f3eee5;
            box-shadow: inset 0 0 0 1px rgba(212, 201, 180, 0.9);
          }
          .invoice::before {
            position: absolute;
            inset: 214px 0 0;
            content: '';
            background:
              linear-gradient(180deg, rgba(255, 253, 248, 0.22), rgba(255, 253, 248, 0.76)),
              url('${logoUrl}') center 176px / 430px auto no-repeat;
            opacity: 0.13;
            pointer-events: none;
            z-index: 0;
          }
          .invoice::after {
            position: absolute;
            left: 100px;
            bottom: 88px;
            width: 190px;
            height: 1px;
            content: '';
            background: rgba(45, 80, 22, 0.22);
            z-index: 0;
          }
          .header {
            position: relative;
            z-index: 1;
            display: flex; justify-content: space-between; align-items: center;
            min-height: 214px; padding: 34px 62px;
            background: linear-gradient(135deg, rgba(33, 60, 16, 0.98), rgba(45, 80, 22, 0.97)), #2d5016;
            color: #fbf7ed;
          }
          .brand {
            display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px;
            min-width: 210px; min-height: 128px; padding: 22px 24px;
            border: 1px solid rgba(251, 247, 237, 0.38); background: rgba(251, 247, 237, 0.08);
          }
          .brand p {
            color: #fbf7ed; font-family: 'Playfair Display', 'Lora', Georgia, serif;
            font-size: 32px; font-weight: 700; line-height: 0.95; text-align: center; text-transform: uppercase;
          }
          .brand small {
            color: rgba(251, 247, 237, 0.82); font-size: 10px; font-weight: 800;
            letter-spacing: 1.7px; text-align: center; text-transform: uppercase;
          }
          .meta { color: #fbf7ed; font-size: 17px; font-weight: 700; letter-spacing: 1.2px; text-align: right; }
          .body { position: relative; z-index: 1; padding: 54px 62px 32px; }
          .summary { display: grid; grid-template-columns: minmax(0, 1fr) 230px; gap: 32px; align-items: start; margin-bottom: 72px; }
          .eyebrow { margin: 0 0 10px; color: #2d5016; font-size: 12px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; }
          .customer h1 { color: #182b0e; font-family: 'Playfair Display', 'Lora', Georgia, serif; font-size: 30px; font-weight: 700; line-height: 1.08; }
          .customer p { margin-top: 8px; color: #77846d; font-size: 13px; line-height: 1.5; }
          .date-card { display: grid; gap: 10px; padding-top: 8px; }
          .date-card div { display: grid; grid-template-columns: 84px 1fr; gap: 12px; align-items: baseline; font-size: 13px; }
          .date-card span { color: #2d5016; font-weight: 800; }
          .date-card strong { color: #77846d; font-weight: 600; text-align: right; }
          .items-section { margin-bottom: 82px; }
          .section-title, .item-row { display: grid; grid-template-columns: minmax(0, 1fr) 150px; gap: 24px; }
          .section-title { margin-bottom: 22px; }
          .section-title h2 { color: #2d5016; font-size: 15px; font-weight: 800; line-height: 1.2; }
          .section-title h2:last-child { text-align: center; }
          .item-row { align-items: center; min-height: 58px; border-bottom: 1px solid #d4c9b4; }
          .item-row p { color: #394932; font-size: 13px; font-weight: 700; }
          .item-row small { display: block; margin-top: 5px; color: #77846d; font-size: 11px; line-height: 1.3; }
          .item-row strong { color: #182b0e; font-size: 13px; font-weight: 700; text-align: center; }
          .totals-section { display: flex; justify-content: flex-end; margin-bottom: 92px; }
          .totals { width: 210px; }
          .totals-row { display: flex; justify-content: space-between; gap: 18px; padding: 7px 0; color: #77846d; font-size: 13px; }
          .totals-row.discount { color: #8b2e2e; }
          .totals-row.grand-total { align-items: center; margin-top: 8px; padding-top: 0; color: #182b0e; font-weight: 800; }
          .totals-row.grand-total span:first-child { padding: 5px 9px; background: #2d5016; color: #fbf7ed; font-size: 13px; line-height: 1; }
          .payment { max-width: 330px; color: #394932; font-size: 12px; line-height: 1.45; }
          .payment p { margin: 0; }
          .payment-label {
            display: inline-block; margin-bottom: 14px !important; padding: 5px 12px; background: #2d5016; color: #fbf7ed;
            font-size: 11px; font-weight: 800; letter-spacing: 2.6px; line-height: 1; text-transform: uppercase;
          }
          .footer { position: relative; z-index: 1; padding: 24px 62px 42px; color: #77846d; }
          .footer p { color: #2d5016; font-family: 'Playfair Display', 'Lora', Georgia, serif; font-size: 17px; font-weight: 700; }
          .footer small { display: block; margin-top: 5px; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; }
          @media print { @page { size: A4; margin: 0; } body { background: #f3eee5; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="brand">
              <p>Casa Torino</p>
              <small>Soluciones gastronómicas</small>
            </div>
            <div class="meta">
              #${orderNumber}
            </div>
          </div>
          <div class="body">
            <section class="summary">
              <div class="customer">
                <p class="eyebrow">Factura para</p>
                <h1>${escapeHtml(order.customer_name ?? 'Cliente sin nombre')}</h1>
                <p>Pedido ${orderNumber}</p>
              </div>
              <div class="date-card">
                <div><span>Fecha:</span><strong>${new Date(order.created_at).toLocaleDateString('es-CO')}</strong></div>
                <div><span>Estado:</span><strong>${escapeHtml(order.status)}</strong></div>
              </div>
            </section>
            <section class="items-section">
              <div class="section-title"><h2>Descripción de servicio</h2><h2>Valor</h2></div>
              <div>${itemsRows}</div>
            </section>
            <section class="totals-section">
              <div class="totals">
                <div class="totals-row"><span>Subtotal</span><span>${format(order.subtotal)}</span></div>
                ${discountRow}
                <div class="totals-row grand-total"><span>Total</span><span>${format(order.total)}</span></div>
              </div>
            </section>
            <section class="payment">
              <p class="payment-label">Forma de pago</p>
              <p>Casa Torino</p>
              <p>Soluciones gastronómicas</p>
              <p>Pago registrado sobre el pedido ${orderNumber}</p>
            </section>
          </div>
          <div class="footer">
            <p>Gracias por elegir Casa Torino</p>
            <small>Soluciones gastronómicas artesanales</small>
          </div>
        </div>
      </body></html>`;
  }
}
