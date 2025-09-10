import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CarsService } from './cars.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit, OnDestroy {
car: any;

  @Input() id: string | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSaved = new EventEmitter<void>();
  @Output() onMessage = new EventEmitter<{ type: 'success' | 'error', text: string }>();

  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef<HTMLInputElement>;

  brands: any[] = [];
  allStores: any[] = [];
  stores: any[] = [];

  form: any = {
    brandId: null,
    storeId: null,
    model: '',
    version: '',
    year: '',
    mileage: null,
    price: null,
    description: '',
    images: [] as any[]
  };

  previewUrls: string[] = [];
  loading = false;

  
  errorText: string | null = null;
  successText: string | null = null;

  submitted = false;

  constructor(private svc: CarsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.svc.getBrands().subscribe({
      next: (b) => { this.brands = b || []; this.onBrandChange(); },
      error: () => { this.brands = []; }
    });

    this.svc.getStores().subscribe({
      next: (s) => { this.allStores = s || []; this.onBrandChange(); },
      error: () => { this.allStores = []; }
    });

    if (this.id) {
      const idNum = Number(this.id);
      if (!Number.isNaN(idNum)) {
        this.svc.getCar(idNum).subscribe({
          next: (c) => {
            this.form = {
              brandId: c.store?.brand?.id ?? null,
              storeId: c.storeId ?? null,
              model: c.model ?? '',
              version: c.version ?? '',
              year: c.year ?? '',
              mileage: c.mileage ?? null,
              price: c.price ?? null,
              description: c.description ?? '',
              images: Array.isArray(c.images) ? c.images : (c.images ? this.safeParseArray(c.images) : [])
            };
            this.buildPreviews();
            this.onBrandChange();
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.revokeAllBlobUrls();
  }

 
  
  private showError(text: string) {
    this.errorText = text;
    this.successText = null;
    this.onMessage.emit({ type: 'error', text });
  }
  private showSuccess(text: string) {
    this.successText = text;
    this.errorText = null;
    this.onMessage.emit({ type: 'success', text });
  }
  private parseBackendError(err: any): string {
    const msg = err?.error?.message ?? err?.message ?? 'Erro ao processar a requisição.';
    if (Array.isArray(msg)) return msg.join('; ');
    return String(msg);
  }
  private safeParseArray(v: string): any[] {
    try { const arr = JSON.parse(v); return Array.isArray(arr) ? arr : []; } catch { return []; }
  }

  private buildPreviews() {
    this.revokeAllBlobUrls();
    this.previewUrls = (this.form.images || []).map((it: any) => {
      if (typeof it === 'string') return it; 
      try { return URL.createObjectURL(it); } catch { return ''; }
    });
  }

  private revokeAllBlobUrls() {
    (this.previewUrls || []).forEach(u => {
      if (u?.startsWith('blob:')) {
        try { URL.revokeObjectURL(u); } catch {}
      }
    });
  }

  onBrandChange(_: any = null) {
    const bId = this.form.brandId !== null && this.form.brandId !== '' ? Number(this.form.brandId) : null;

    if (this.allStores?.length && typeof this.allStores[0]?.brandId !== 'undefined') {
      this.stores = bId ? this.allStores.filter(s => Number(s.brandId) === bId) : [];
    } else {
      const brand = this.brands.find(b => Number(b.id) === bId);
      if (!brand) { this.stores = []; this.form.storeId = null; return; }
      this.svc.getStoresByBrandName(brand.name).subscribe({
        next: (s) => {
          this.stores = s || [];
          if (!this.stores.some(x => Number(x.id) === Number(this.form.storeId))) this.form.storeId = null;
        },
        error: () => { this.stores = []; this.form.storeId = null; }
      });
      return;
    }

    if (!this.stores.some(x => Number(x.id) === Number(this.form.storeId))) this.form.storeId = null;
  }

 

private async uploadNewFilesIfAny(): Promise<string[]> {
  const imgs: any[] = this.form.images || [];
  const urls: string[] = [];
  const API = 'http://localhost:3000'; 

  for (const it of imgs) {
    if (typeof it === 'string' && it.trim() !== '') {
      urls.push(it);
    } else if (it && typeof it === 'object') {
      const fd = new FormData();
      fd.append('file', it);
      const res = await lastValueFrom(this.http.post<{ url: string }>(`${API}/api/uploads`, fd));
      urls.push(res.url); 
    }
  }
    return urls;
  }

  async onSubmit(formDirective: NgForm) {
    this.submitted = true;
    this.errorText = null;
    this.successText = null;


    const brandExists = this.brands?.some(b => Number(b.id) === Number(this.form.brandId));
    const storeOk = this.stores?.some(s => Number(s.id) === Number(this.form.storeId));
    if (!brandExists) { this.showError('Marca inválida.'); return; }
    if (!storeOk) { this.showError('Loja inválida para a marca selecionada.'); return; }
    if (!this.form.model?.trim()) { this.showError('Informe o modelo.'); return; }
    if (!this.form.version?.trim()) { this.showError('Informe a versão.'); return; }
    if (!this.form.year?.trim()) { this.showError('Informe o ano.'); return; }

    this.loading = true;

    try {

      const imageUrls = await this.uploadNewFilesIfAny();

      const payload = {
        brandId: this.form.brandId !== null && this.form.brandId !== '' ? Number(this.form.brandId) : null,
        storeId: this.form.storeId !== null && this.form.storeId !== '' ? Number(this.form.storeId) : null,
        model: String(this.form.model ?? ''),
        version: String(this.form.version ?? ''),
        year: String(this.form.year ?? ''),
        mileage: this.form.mileage !== null && this.form.mileage !== '' ? Number(this.form.mileage) : null,
        price: this.form.price !== null && this.form.price !== '' ? Number(this.form.price) : null,
        description: this.form.description ?? '',
        images: imageUrls
      };


      const obs = this.id ? this.svc.updateCar(Number(this.id), payload) : this.svc.createCar(payload);
      await lastValueFrom(obs);

      this.loading = false;
      this.showSuccess(this.id ? 'Veículo atualizado com sucesso.' : 'Veículo cadastrado com sucesso.');
      this.onSaved.emit();
      this.onClose.emit();
    } catch (err) {
      this.loading = false;
      const msg = err instanceof Error ? err.message : this.parseBackendError(err);
      this.showError(msg);
    }
  }

  triggerFileDialog() {
    this.fileInput?.nativeElement?.click();
  }

  onFilesSelected($event: Event) {
    const input = $event.target as HTMLInputElement;
    if (!input?.files) return;
    Array.from(input.files).forEach(f => {
      this.form.images = this.form.images || [];
      this.form.images.push(f);
      try { this.previewUrls.push(URL.createObjectURL(f)); } catch { this.previewUrls.push(''); }
    });
    if (input) input.value = '';
  }

  removeImageAt(index: number) {
    if (!this.form.images || !this.form.images[index]) return;
    const preview = this.previewUrls[index];
    if (preview?.startsWith('blob:')) {
      try { URL.revokeObjectURL(preview); } catch {}
    }
    this.form.images.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }


  remove() {
    if (!this.id) return;


    const confirmed = confirm('Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.');
    if (!confirmed) return;

    const idNum = Number(this.id);
    if (Number.isNaN(idNum)) return;

    this.loading = true;
    this.svc.deleteCar(idNum).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccess('Veículo excluído com sucesso.');
        this.onSaved.emit();
        this.onClose.emit();
      },
      error: (err) => {
        this.loading = false;
        this.showError(this.parseBackendError(err));
      }
    });
  }


  trackByIndex(i: number) { return i; }
}