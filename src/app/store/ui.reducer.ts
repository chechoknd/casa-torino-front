import { createReducer, on } from '@ngrx/store';
import { uiActions } from './ui.actions';

export interface UiState {
  pendingRequests: number;
}

export const initialUiState: UiState = {
  pendingRequests: 0
};

export const uiReducer = createReducer(
  initialUiState,
  on(uiActions.requestStarted, (state) => ({
    pendingRequests: state.pendingRequests + 1
  })),
  on(uiActions.requestFinished, (state) => ({
    pendingRequests: Math.max(0, state.pendingRequests - 1)
  }))
);

