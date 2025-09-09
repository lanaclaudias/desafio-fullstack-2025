import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CarsService } from './cars.service';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit {
  @Input() id: string | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSaved = new EventEmitter<void>();
  @Output() onMessage = new EventEmitter<any>();

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
    images: []
  };
  loading = false;
  message = '';
  missingFields: string[] = [];

  constructor(private svc: CarsService) {}

  ngOnInit(): void {
    this.svc.getBrands().subscribe({
      next: (b: any[]) => {
        this.brands = b || [];
        console.debug('getBrands ->', this.brands);
        this.onBrandChange();
      },
      error: (err) => {
        console.error('getBrands error', err);
        this.brands = [];
      }
    });

    this.svc.getStores().subscribe({
      next: (s: any[]) => {
        this.allStores = s || [];
        console.debug('getStores ->', this.allStores);
        this.onBrandChange();
      },
      error: (err) => {
        console.error('getStores error', err);
        this.allStores = [];
      }
    });

    if (this.id) {
      const idNum = Number(this.id);
      if (!Number.isNaN(idNum) && this.svc.getCar) {
        this.svc.getCar(idNum).subscribe({
          next: (c: any) => {
            this.form = {
              brandId: c.store?.brand?.id ?? null,
              storeId: c.storeId ?? null,
              model: c.model ?? '',
              version: c.version ?? '',
              year: c.year ?? '',
              mileage: c.mileage ?? null,
              price: c.price ?? null,
              description: c.description ?? '',
              images: Array.isArray(c.images) ? c.images : (c.images ? JSON.parse(c.images) : [])
            };
            console.debug('loaded car for edit ->', this.form);
            this.onBrandChange();
          },
          error: (err) => {
            console.error('getCar error', err);
          }
        });
      }
    }
  }

  // aceita opcionalmente o evento vindo de ngModelChange
  onBrandChange(eventValue?: any) {
    // log claro e imediato para identificar disparo
    console.debug('onBrandChange fired', { eventValue, selectedBrand: this.form.brandId });

    const bId = this.form.brandId !== null && this.form.brandId !== '' ? Number(this.form.brandId) : null;
    console.debug('computed bId=', bId, 'allStores.length=', this.allStores?.length);

    if (!this.allStores || this.allStores.length === 0) {
      this.stores = [];
      console.debug('allStores vazio — stores vazias');
      return;
    }

    this.stores = bId ? (this.allStores || []).filter(s => Number(s.brandId) === bId) : [];
    console.debug('filtered stores ->', this.stores);

    if (!this.stores.some(s => s.id === Number(this.form.storeId))) {
      this.form.storeId = null;
    }
  }

  onSubmit(formDirective: NgForm) {
    const payload = {
      ...this.form,
      brandId: this.form.brandId !== null && this.form.brandId !== '' ? Number(this.form.brandId) : null,
      storeId: this.form.storeId !== null && this.form.storeId !== '' ? Number(this.form.storeId) : null,
      mileage: this.form.mileage !== null && this.form.mileage !== '' ? Number(this.form.mileage) : null,
      price: this.form.price !== null && this.form.price !== '' ? Number(this.form.price) : null,
      images: (this.form.images || []).map((i: any) => (typeof i === 'string' ? i : (i.name || i)))
    };

    console.debug('Frontend brands:', this.brands);
    console.debug('Frontend allStores:', this.allStores);
    console.debug('Car submit payload:', payload);

    const brandExists = this.brands?.some(b => Number(b.id) === Number(payload.brandId));
    if (!brandExists) {
      this.svc.getBrands().subscribe({
        next: (b: any[]) => {
          this.brands = b;
          const existsNow = this.brands?.some(bb => Number(bb.id) === Number(payload.brandId));
          if (!existsNow) {
            this.message = `Marca inválida (recebido="${payload.brandId}"). Marcas disponíveis: ${this.brands?.map(x => x.id+':'+x.name).join(', ') || 'nenhuma'}`;
            this.onMessage.emit({ type: 'error', text: this.message });
            return;
          } else {
            this.sendPayload(payload);
          }
        },
        error: () => {
          this.message = 'Falha ao validar marcas';
          this.onMessage.emit({ type: 'error', text: this.message });
        }
      });
      return;
    }

    const storeOk = this.allStores?.some(s => Number(s.id) === Number(payload.storeId) && Number(s.brandId) === Number(payload.brandId));
    if (!storeOk) {
      this.message = 'Loja inválida para a marca selecionada.';
      this.onMessage.emit({ type: 'error', text: this.message });
      return;
    }

    this.sendPayload(payload);
  }

  private sendPayload(payload: any) {
    this.loading = true;
    const obs = this.id ? this.svc.updateCar(Number(this.id), payload) : this.svc.createCar(payload);
    obs.subscribe({
      next: () => {
        this.loading = false;
        this.onSaved.emit();
        this.onMessage.emit({ type: 'success', text: this.id ? 'Edição realizada com sucesso' : 'Cadastro concluído' });
        setTimeout(() => this.onClose.emit(), 400);
      },
      error: (err: any) => {
        this.loading = false;
        this.message = err?.error?.message || err?.message || 'Erro ao salvar';
        this.onMessage.emit({ type: 'error', text: this.message });
        console.error(err);
      }
    });
  }

  // demais métodos (triggerFileDialog, onFilesSelected, getObjectURL, removeImageAt, remove, isString)
  triggerFileDialog() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  onFilesSelected($event: Event) {
    const input = $event.target as HTMLInputElement;
    if (!input || !input.files) return;
    Array.from(input.files).forEach(f => {
      this.form.images = this.form.images || [];
      this.form.images.push(f);
    });
    if (input) input.value = '';
  }

  getObjectURL(item: any) {
    if (!item) return '';
    if (typeof item === 'string') return item;
    try { return URL.createObjectURL(item); } catch { return ''; }
  }

  removeImageAt(index: number) {
    if (!this.form.images || !this.form.images[index]) return;
    const it = this.form.images[index];
    if (it && typeof it !== 'string') {
      try { URL.revokeObjectURL(this.getObjectURL(it)); } catch {}
    }
    this.form.images.splice(index, 1);
  }

  remove() {
    if (!this.id) return;
    const idNum = Number(this.id);
    if (Number.isNaN(idNum)) return;
    this.loading = true;
    if (!this.svc.deleteCar) {
      this.loading = false;
      this.message = 'Operação de exclusão não disponível';
      return;
    }
    this.svc.deleteCar(idNum).subscribe({
      next: () => {
        this.loading = false;
        this.onMessage.emit({ type: 'success', text: 'Registro excluído' });
        this.onSaved.emit();
        this.onClose.emit();
      },
      error: (err: any) => {
        this.loading = false;
        this.message = err?.error?.message || err?.message || 'Erro ao excluir';
        this.onMessage.emit({ type: 'error', text: this.message });
        console.error(err);
      }
    });
  }

  isString(v: any) {
    return typeof v === 'string';
  }
}