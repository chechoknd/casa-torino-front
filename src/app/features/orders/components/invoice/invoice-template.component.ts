import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrderDetail, OrderItem } from '../../../../core/models/order.model';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';

@Component({
  selector: 'ct-invoice-template',
  standalone: true,
  imports: [DatePipe, CurrencyCopPipe],
  template: `
    <div id="invoice-container" class="invoice-container">
      <div class="invoice">
        <header class="invoice-header">
          <div class="brand">
            <p>Casa Torino</p>
            <small>Soluciones gastronómicas</small>
          </div>
          <div class="invoice-meta">
            <p class="invoice-number">#{{ order.order_label ?? order.order_number ?? order.id }}</p>
          </div>
        </header>

        <main class="invoice-body">
          <section class="invoice-summary" aria-label="Información de factura">
            <div class="customer-section">
              <p class="eyebrow">Factura para</p>
              <h1>{{ order.customer_name ?? 'Cliente sin nombre' }}</h1>
              <p>Pedido {{ order.order_label ?? order.order_number ?? order.id }}</p>
            </div>

            <div class="date-card">
              <div>
                <span>Fecha:</span>
                <strong>{{ order.created_at | date: 'dd/MM/yyyy' }}</strong>
              </div>
              <div>
                <span>Estado:</span>
                <strong>{{ order.status }}</strong>
              </div>
            </div>
          </section>

          <section class="items-section" aria-label="Detalle de productos">
            <div class="section-title">
              <h2>Descripción de servicio</h2>
              <h2>Valor</h2>
            </div>

            <div class="items-list">
              @for (item of order.items; track item.id ?? $index) {
                <div class="item-row">
                  <div>
                    <p>{{ item.product_name ?? 'Producto sin nombre' }}</p>
                    <small>Cantidad: {{ item.quantity }} · Unitario: {{ unitPrice(item) | currencyCop }}</small>
                  </div>
                  <strong>{{ (item.subtotal ?? item.total ?? 0) | currencyCop }}</strong>
                </div>
              }
            </div>
          </section>

          <section class="totals-section" aria-label="Totales">
            <div class="totals">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>{{ order.subtotal | currencyCop }}</span>
              </div>
              @if (order.discount) {
                <div class="totals-row discount">
                  <span>Descuento</span>
                  <span>-{{ order.discount | currencyCop }}</span>
                </div>
              }
              <div class="totals-row grand-total">
                <span>Total</span>
                <span>{{ order.total | currencyCop }}</span>
              </div>
            </div>
          </section>

          <section class="payment-section" aria-label="Forma de pago">
            <p class="payment-label">Forma de pago</p>
            <p>Casa Torino</p>
            <p>Soluciones gastronómicas</p>
            <p>Pago registrado sobre el pedido {{ order.order_label ?? order.order_number ?? order.id }}</p>
          </section>
        </main>

        <footer class="invoice-footer">
          <p>Gracias por elegir Casa Torino</p>
          <small>Soluciones gastronómicas artesanales</small>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .invoice-container {
      width: 794px;
      min-height: 1123px;
      padding: 0;
      background: #f3eee5;
      font-family: 'DM Sans', 'Nunito', 'Outfit', Arial, sans-serif;
      color: #182b0e;
    }

    .invoice {
      position: relative;
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
        url('/assets/images/casa_torino_logo.jpg') center 176px / 430px auto no-repeat;
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

    .invoice-header {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 214px;
      padding: 34px 62px;
      background:
        linear-gradient(135deg, rgba(33, 60, 16, 0.98), rgba(45, 80, 22, 0.97)),
        #2d5016;
      color: #fbf7ed;
    }

    .brand {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
      min-width: 210px;
      min-height: 128px;
      padding: 22px 24px;
      border: 1px solid rgba(251, 247, 237, 0.38);
      background: rgba(251, 247, 237, 0.08);
    }

    .brand p {
      margin: 0;
      color: #fbf7ed;
      font-family: 'Playfair Display', 'Lora', Georgia, serif;
      font-size: 32px;
      font-weight: 700;
      line-height: 0.95;
      text-align: center;
      text-transform: uppercase;
    }

    .brand small {
      color: rgba(251, 247, 237, 0.82);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.7px;
      text-align: center;
      text-transform: uppercase;
    }

    .invoice-meta {
      align-self: center;
      text-align: right;
    }

    .invoice-number {
      margin: 0;
      color: #fbf7ed;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 1.2px;
    }

    .invoice-body {
      position: relative;
      z-index: 1;
      padding: 54px 62px 32px;
    }

    .invoice-summary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 230px;
      gap: 32px;
      align-items: start;
      margin-bottom: 72px;
    }

    .customer-section .eyebrow {
      margin: 0 0 10px;
      color: #2d5016;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.4px;
      text-transform: uppercase;
    }

    .customer-section h1 {
      margin: 0;
      color: #182b0e;
      font-family: 'Playfair Display', 'Lora', Georgia, serif;
      font-size: 30px;
      font-weight: 700;
      line-height: 1.08;
    }

    .customer-section p {
      margin: 8px 0 0;
      color: #77846d;
      font-size: 13px;
      line-height: 1.5;
    }

    .date-card {
      display: grid;
      gap: 10px;
      padding-top: 8px;
    }

    .date-card div {
      display: grid;
      grid-template-columns: 84px 1fr;
      gap: 12px;
      align-items: baseline;
      font-size: 13px;
    }

    .date-card span {
      color: #2d5016;
      font-weight: 800;
    }

    .date-card strong {
      color: #77846d;
      font-weight: 600;
      text-align: right;
    }

    .items-section {
      margin-bottom: 82px;
    }

    .section-title,
    .item-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 150px;
      gap: 24px;
    }

    .section-title {
      margin-bottom: 22px;
    }

    .section-title h2 {
      margin: 0;
      color: #2d5016;
      font-size: 15px;
      font-weight: 800;
      line-height: 1.2;
    }

    .section-title h2:last-child {
      text-align: center;
    }

    .items-list {
      display: grid;
      gap: 0;
    }

    .item-row {
      align-items: center;
      min-height: 58px;
      border-bottom: 1px solid #d4c9b4;
    }

    .item-row p {
      margin: 0;
      color: #394932;
      font-size: 13px;
      font-weight: 700;
    }

    .item-row small {
      display: block;
      margin-top: 5px;
      color: #77846d;
      font-size: 11px;
      line-height: 1.3;
    }

    .item-row strong {
      color: #182b0e;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
    }

    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 92px;
    }

    .totals {
      width: 210px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      padding: 7px 0;
      color: #77846d;
      font-size: 13px;
    }

    .totals-row.discount {
      color: #8b2e2e;
    }

    .totals-row.grand-total {
      align-items: center;
      margin-top: 8px;
      padding-top: 0;
      color: #182b0e;
      font-weight: 800;
    }

    .totals-row.grand-total span:first-child {
      padding: 5px 9px;
      background: #2d5016;
      color: #fbf7ed;
      font-size: 13px;
      line-height: 1;
    }

    .payment-section {
      max-width: 330px;
      color: #394932;
      font-size: 12px;
      line-height: 1.45;
    }

    .payment-section p {
      margin: 0;
    }

    .payment-label {
      display: inline-block;
      margin-bottom: 14px !important;
      padding: 5px 12px;
      background: #2d5016;
      color: #fbf7ed;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2.6px;
      line-height: 1;
      text-transform: uppercase;
    }

    .invoice-footer {
      position: relative;
      z-index: 1;
      padding: 24px 62px 42px;
      color: #77846d;
    }

    .invoice-footer p {
      margin: 0;
      color: #2d5016;
      font-family: 'Playfair Display', 'Lora', Georgia, serif;
      font-size: 17px;
      font-weight: 700;
    }

    .invoice-footer small {
      display: block;
      margin-top: 5px;
      font-size: 11px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceTemplateComponent {
  @Input({ required: true }) order!: OrderDetail;

  protected unitPrice(item: OrderItem): number {
    if (item.unit_price) {
      return item.unit_price;
    }

    if (!item.quantity) {
      return 0;
    }

    return (item.subtotal ?? item.total ?? 0) / item.quantity;
  }
}
