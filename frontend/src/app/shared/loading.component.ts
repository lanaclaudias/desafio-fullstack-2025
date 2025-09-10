import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../core/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="loading.loading$ | async">
      <div class="spinner"></div>
      <div class="debug">Carregando...</div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(102, 211, 104, 0.12);
      z-index: 2147483647 !important;
      pointer-events: auto;
    }
    .spinner {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 6px solid rgba(121, 211, 82, 0.1);
      border-top-color: #0a7a51;
      animation: spin 0.8s linear infinite;
    }
    .debug {
      margin-top: 12px;
      color: #000;
      font-weight: 600;
      background: rgba(255,255,255,0.8);
      padding: 4px 8px;
      border-radius: 4px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingComponent {
  constructor(public loading: LoadingService) {
    console.log('LoadingComponent initialized');
    this.loading.loading$.subscribe(v => console.log('LoadingComponent sees ->', v));
  }
}