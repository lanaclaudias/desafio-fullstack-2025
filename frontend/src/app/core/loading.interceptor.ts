import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loading: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const ignore = /(\.svg|\.png|\.jpg|\.jpeg|\.webp|\/assets\/|\/uploads\/)/i.test(req.url || '');
    if (!ignore) this.loading.show();
    return next.handle(req).pipe(finalize(() => { if (!ignore) this.loading.hide(); }));
  }
}