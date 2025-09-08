
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Output() onMessage = new EventEmitter<{type:'success'|'error', text:string}>();

  form: any = { model: '', version: '', year: '', mileage: '', price: '', description: '', brandId: '', storeId: '', images: [] };
  brands: any[] = [];
  stores: any[] = [];
  allStores: any[] = [];
  brandsLoaded = false;
  storesLoaded = false;
  loading = false;
  message: any = null;
  missingFields: string[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private svc: CarsService) {}

  ngOnInit() {
    this.svc.getBrands().subscribe(r=> {
      this.brands = (r.data || r).map((b:any)=> ({ ...b, stores: b.stores || [] }));
      this.brandsLoaded = true;
      this.maybeLoadCarAfterData();
    }, err => { console.debug('Falha ao carregar brands', err); this.brandsLoaded = true; this.maybeLoadCarAfterData(); });

    this.svc.getStores().subscribe(r => {
      this.allStores = r.data || r || [];
      this.storesLoaded = true;
      this.maybeLoadCarAfterData();
    }, err => { console.debug('Falha ao carregar stores (getStores)', err); this.storesLoaded = true; this.maybeLoadCarAfterData(); });
  }

  maybeLoadCarAfterData() {
    if (!this.id) return;
    if (!this.brandsLoaded || !this.storesLoaded) return;

    this.svc.getCar(Number(this.id)).subscribe(r=> {
      const car = r.data || r;
      this.form = { ...this.form, ...car };

      try {
        if (car.images) {
          if (typeof car.images === 'string') {
            const parsed = JSON.parse(car.images);
            this.form.images = Array.isArray(parsed) ? parsed : [car.images];
          } else if (Array.isArray(car.images)) {
            this.form.images = car.images;
          } else {
            this.form.images = [String(car.images)];
          }
        } else {
          this.form.images = [];
        }
      } catch (e) {
        this.form.images = typeof car.images === 'string' ? [car.images] : (car.images || []);
      }

      if (car.store) {
        this.form.storeId = car.store.id;
        const brandId = car.store.brand && car.store.brand.id ? car.store.brand.id : (typeof car.store.brand === 'string' || typeof car.store.brand === 'number' ? car.store.brand : null);
        this.form.brandId = brandId ?? this.form.brandId;
        this.filterStoresByBrandId(this.form.brandId);
      }
    }, err => { console.debug('Falha ao carregar car', err); });
  }

  loadStoresByBrand(brandName: string) {
    if (!brandName) { this.stores = []; return; }

    const matched = this.allStores.filter(s => s && s.brand && (s.brand.name === brandName || s.brand === brandName || s.brand?.id == this.form.brandId));
    if (matched.length) { this.stores = matched; return; }
    this.svc.getStoresByBrand(brandName).subscribe(r=> this.stores = r.data || r, err => { console.debug('fallback getStoresByBrand failed', err); this.stores = []; });
  }

  onBrandChange() {
    const brand = this.brands.find(b=> b.id == this.form.brandId);
    this.form.storeId = '';
    this.filterStoresByBrandId(this.form.brandId);
    if ((!this.stores || !this.stores.length) && brand) {
      this.stores = brand.stores || [];
    }
    console.debug('onBrandChange -> brandId, stores count', this.form.brandId, this.stores.length);
  }

  filterStoresByBrandId(brandId: any) {
    if (!brandId) { this.stores = []; return; }

    const filtered = (this.allStores || []).filter((s:any) => {
      if (!s) return false;
      if (s.brand && typeof s.brand === 'object') return s.brand.id == brandId;
      return s.brand == brandId;
    });
    this.stores = filtered;
  }

  onFilesSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []) as File[];
    if (!this.form.images) this.form.images = [];

    const readers = files.map(f => new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = e => rej(e);
      r.readAsDataURL(f);
    }));
    Promise.all(readers).then(strs => {
      this.form.images = [...this.form.images, ...strs];
    }).catch(err => console.debug('failed to read files', err));
    input.value = '';
  }

  removeImageAt(index: number) {
    this.form.images = (this.form.images || []).filter((_: any, i: number) => i !== index);
  }

  isString(val: any) { return typeof val === 'string'; }

  getObjectURL(file: any) { 
    if (!file) return '';
    if (typeof file === 'string') return file; 
    try { return URL.createObjectURL(file); } catch { return ''; }
  }

  triggerFileDialog() {
    try { this.fileInput.nativeElement.click(); } catch { /* fallback */ }
  }


  onSubmit(carForm: NgForm) {

    try { Object.values(carForm.controls || {}).forEach((c:any) => c.markAsTouched && c.markAsTouched()); } catch {}

    this.missingFields = [];
    this.message = null;

    const requiredChecks: { key: string; label: string }[] = [
      { key: 'brandId', label: 'Marca' },
      { key: 'storeId', label: 'Loja' },
      { key: 'model', label: 'Modelo' },
      { key: 'version', label: 'Versão' },
      { key: 'year', label: 'Ano' },
      { key: 'mileage', label: 'Quilometragem' },
      { key: 'price', label: 'Valor' }
    ];

    for (const c of requiredChecks) {
      const val = this.form[c.key];
      const empty = val === null || val === undefined || String(val).trim() === '';
      if (empty) this.missingFields.push(c.label);
    }

    if (this.missingFields.length) {
      this.message = `Preencha os campos obrigatórios: ${this.missingFields.join(', ')}`;
    
      setTimeout(() => { this.message = null; this.missingFields = []; }, 5000);
      return;
    }

   
    this.submit();
  }

  submit() {
    this.loading = true;
    const payload = { ...this.form };
    if (this.id) {
      this.svc.updateCar(Number(this.id), payload).subscribe(()=> {
        this.message = 'Edição realizada com sucesso !!'; this.onSaved.emit(); this.onMessage.emit({ type: 'success', text: 'Edição realizada com sucesso' }); setTimeout(()=> this.onClose.emit(),800)
      }, (err:any)=> {
        const text = err?.error?.message || err?.message || 'Falha';
        this.message = text; this.onMessage.emit({ type: 'error', text }); this.loading = false;
      })
    } else {
      this.svc.createCar(payload).subscribe(()=> {
        this.message='Cadastro concluído com sucesso !!'; this.onSaved.emit(); this.onMessage.emit({ type: 'success', text: 'Cadastro concluído' }); setTimeout(()=> this.onClose.emit(),800)
      }, (err:any)=> {
        const text = err?.error?.message || err?.message || 'Falha';
        this.message = text; this.onMessage.emit({ type: 'error', text }); this.loading = false;
      })
    }
  }

  remove() {
    if (!this.id) return;
    if (!confirm('Confirma exclusão?')) return;
    this.svc.deleteCar(Number(this.id)).subscribe(()=> { this.message='Exclusão realizada'; this.onSaved.emit(); this.onMessage.emit({ type: 'success', text: 'Exclusão realizada com sucesso !! ' }); setTimeout(()=> this.onClose.emit(),800) }, (err:any)=> { const text = err?.error?.message || err?.message || 'Falha'; this.onMessage.emit({ type: 'error', text }); })
  }
}
