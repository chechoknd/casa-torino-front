import { createActionGroup, emptyProps } from '@ngrx/store';

export const uiActions = createActionGroup({
  source: 'UI',
  events: {
    'Request Started': emptyProps(),
    'Request Finished': emptyProps()
  }
});

