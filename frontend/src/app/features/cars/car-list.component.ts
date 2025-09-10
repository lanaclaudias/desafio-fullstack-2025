import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarsService } from './cars.service';
import { CarFormComponent } from './car-form.component';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, CarFormComponent],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  cars: any[] = [];
  showForm = false;
  editId: any = null;
  message: {type:'success'|'error', text:string} | null = null;
  visibleIdx: Record<string, number> = {};

  private API_BASE = 'http://localhost:3000';
 PLACEHOLDER_IMG = 'https://via.placeholder.com/640x360?text=Sem+imagem';


  menuOpen = false;

  constructor(private svc: CarsService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.svc.getCars().subscribe((r: any) => {
     
      this.cars = Array.isArray(r) ? r : (r && r.data ? r.data : r);
    });
    setTimeout(() => {
      const map: any = {}; 
      this.cars.forEach(c => map[c.id] = 0); 
      this.visibleIdx = map;
    }, 0);
  }

  openForm(id?: any) { 
    this.editId = id || null; 
    this.showForm = true; 
  }
closeForm() {
    this.showForm = false;
    this.editId = null;
  }
  onSaved() { 
    this.showForm = false; 
    this.load(); 
  }

  onMessage(msg: {type:'success'|'error', text:string}) { 
    this.message = msg; 
    setTimeout(() => this.message = null, 3500); 
  }

  setVisibleIdx(carId: any, idx: number) {
    const imgs = this.getImages(this.cars.find((c: any) => c.id == carId));
    const len = imgs.length || 1;
    let next = idx;
    if (next < 0) next = len - 1;
    if (next >= len) next = 0;
    this.visibleIdx = { ...this.visibleIdx, [carId]: next };
  }
confirmDelete(carId: any) {
    const ok = confirm('Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.');
    if (!ok) return;

    this.svc.deleteCar(Number(carId)).subscribe({
      next: () => {
        this.onMessage({ type: 'success', text: 'Veículo excluído com sucesso.' });
        this.load();
      },
      error: (err) => {
        const text = err?.error?.message ?? err?.message ?? 'Erro ao excluir veículo.';
        this.onMessage({ type: 'error', text: String(text) });
      }
    });
  }
  getImages(car: any): string[] {
    try {
      let raw = car?.images ?? [];
      if (typeof raw === 'string') {
        const s = raw.trim();
        raw = s.startsWith('[') ? JSON.parse(s) : (s ? [s] : []);
      }
      const arr = (Array.isArray(raw) ? raw : [])
        .map((v: any) => String(v))
        .filter(Boolean)
        .map((s) => this.normalizeUrl(s));
      return arr.length ? arr : [this.PLACEHOLDER_IMG];
    } catch {
      return [this.PLACEHOLDER_IMG];
    }
  }

 private normalizeUrl(s: string): string {
  if (/^https?:\/\//i.test(s) || s.startsWith('blob:') || s.startsWith('data:')) return s;
  if (s.startsWith('/uploads/')) return `${this.API_BASE}${s}`;
  if (!s.startsWith('/')) return `${this.API_BASE}/uploads/${encodeURIComponent(s)}`;
  return s;
}
onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = this.PLACEHOLDER_IMG;
}
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
