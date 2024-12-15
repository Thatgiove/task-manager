import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideStore, StoreModule } from '@ngrx/store';
import { boardsReducer } from './state/tasks.reducer';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, StoreModule],
      providers: [provideStore({ boards: boardsReducer })]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'task-manager' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Task Manager');
  });


});
