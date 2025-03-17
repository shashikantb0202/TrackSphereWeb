import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './app/auth/auth.interceptor';
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
     BrowserAnimationsModule,
     provideHttpClient(withInterceptors([authInterceptor])),
    
    provideAnimations(), provideToastr({
      timeOut: 3000,         // Auto close after 3 seconds
      positionClass: 'toast-top-right',  // Position of the toast
      preventDuplicates: true,  // Prevent duplicate toasts
      progressBar: true        // Show progress bar
    }),
    ]
}).catch(err => console.error(err));

function provideNgxPagination(arg0: { itemsPerPage: number; }): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}
