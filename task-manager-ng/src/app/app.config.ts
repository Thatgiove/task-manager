import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { boardsReducer } from './state/tasks.reducer';
import { BoardsEffects } from './state/boards.effects';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
  provideStore({ boards: boardsReducer }), provideEffects(BoardsEffects), provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
