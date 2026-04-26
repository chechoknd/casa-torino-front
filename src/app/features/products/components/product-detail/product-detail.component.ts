import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { CurrencyCopPipe } from '../../../../shared/pipes/currency-cop.pipe';
import { productsActions } from '../../store/products.actions';
import { selectSelectedProduct } from '../../store/products.selectors';

@Component({
  selector: 'ct-product-detail',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, MatButtonModule, MatCardModule, CurrencyCopPipe],
  template: `
    <mat-card class="page-card detail-card" *ngIf="product$ | async as product">
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <p>Tipo: {{ product.product_type }}</p>
      <p>Precio base: {{ product.base_price | currencyCop }}</p>
      <p>Costo: {{ product.cost_price | currencyCop }}</p>
      <p>Estado: {{ product.is_active ? 'Activo' : 'Inactivo' }}</p>
      <a mat-stroked-button [routerLink]="['/products/edit', product.id]">Editar</a>
    </mat-card>
  `,
  styles: ['.detail-card{padding:1.5rem}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  protected readonly product$ = this.store.select(selectSelectedProduct);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(productsActions.loadProductDetail({ id }));
    }
  }
}

