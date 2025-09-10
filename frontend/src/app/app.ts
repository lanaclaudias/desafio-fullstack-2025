import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarListComponent } from './features/cars/car-list.component';
import { LoadingComponent } from './shared/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CarListComponent, LoadingComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
}
