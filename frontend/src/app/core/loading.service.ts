import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private requests = 0;
  private _loading$ = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading$.asObservable();
  private _message$ = new BehaviorSubject<string | null>(null);
  public message$ = this._message$.asObservable();

  private minDuration = 400;
  private lastShownAt = 0;
  private hideTimeout: any;

  show(onmessage?: string | null) {
    this.requests++;
    if (this.requests === 1) {
  
      this.lastShownAt = Date.now();
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = undefined;
      }
      this._message$.next(onmessage ?? null);
      this._loading$.next(true);
    } else if (onmessage) {
      this._message$.next(onmessage);
    }
 
    console.log('loading show', this.requests);
  }
  setMessage(msg: string | null) {
    this._message$.next(msg);
  }
  hide() {
    this.requests = Math.max(0, this.requests - 1);
 
    if (this.requests > 0) {
      console.log('loading hide (pending requests remain)', this.requests);
      return;
    }

    const elapsed = Date.now() - this.lastShownAt;
    const remaining = this.minDuration - elapsed;

    if (remaining > 0) {
 
      this.hideTimeout = setTimeout(() => {
        this._loading$.next(false);
        this.hideTimeout = undefined;
      }, remaining);
    } else {
      this._loading$.next(false);
    }
    console.log('loading hide', this.requests);
  }

  reset() {
    this.requests = 0;
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
    this._loading$.next(false);
      this._message$.next(null);
  }
}