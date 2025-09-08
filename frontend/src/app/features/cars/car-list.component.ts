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


  menuOpen = false;

  constructor(private svc: CarsService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.svc.getCars().subscribe(r => this.cars = r.data || r);
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

  getImages(car: any) {
    if (!car) return ['/placeholder.jpg'];
    const imgs = car.images;
    if (!imgs) return ['/placeholder.jpg'];
    try {
      if (typeof imgs === 'string') {
        const parsed = JSON.parse(imgs);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
      if (Array.isArray(imgs) && imgs.length) return imgs;
    } catch (e) {
      if (typeof imgs === 'string' && imgs.length) return [imgs];
    }
    return ['/placeholder.jpg'];
  }


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
