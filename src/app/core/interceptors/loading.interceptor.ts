import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Store } from '@ngrx/store';
import { uiActions } from '../../store/ui.actions';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  store.dispatch(uiActions.requestStarted());

  return next(req).pipe(finalize(() => store.dispatch(uiActions.requestFinished())));
};

