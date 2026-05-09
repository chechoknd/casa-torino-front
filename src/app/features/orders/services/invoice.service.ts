import { ApplicationRef, EnvironmentInjector, Injectable, createComponent, inject } from '@angular/core';
import { OrderDetail } from '../../../core/models/order.model';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  async downloadInvoice(order: OrderDetail): Promise<void> {
    const { default: html2canvas } = await import('html2canvas');

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    const { InvoiceTemplateComponent } = await import(
      '../components/invoice/invoice-template.component'
    );

    const componentRef = createComponent(InvoiceTemplateComponent, {
      environmentInjector: this.environmentInjector
    });
    componentRef.setInput('order', order);
    this.appRef.attachView(componentRef.hostView);
    container.appendChild(componentRef.location.nativeElement);
    document.body.appendChild(container);

    await this.stampComponent(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f6f0e3',
        allowTaint: false,
        logging: false,
        width: 794,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = 297;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const filename = `Factura_Casa_Torino_${order.order_label ?? order.order_number ?? order.id}.pdf`;
      pdf.save(filename);
    } finally {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      document.body.removeChild(container);
    }
  }

  private async stampComponent(container: HTMLElement): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  }
}
