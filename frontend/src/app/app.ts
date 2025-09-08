import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarListComponent } from './features/cars/car-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CarListComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
}
