import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from './layout/hero/hero.component';
import { MoviesService } from './features/movies/movies/movies.service';
import { Movie } from './features/movies/models/movie.interface';
import { NavbarComponent } from './layout/navbar/navbar.component';

@Component({
  imports: [RouterOutlet, HeroComponent, NavbarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  private readonly _moviesService = inject(MoviesService);
  heroMovie(): Movie | null {
    return this._moviesService.selectedMovie(); // Asegúrate de que devuelve un valor válido
  }

  title = 'andres-movies';
  showButton = false;

  constructor() {
    window.addEventListener('scroll', () => {
      this.showButton = window.scrollY > 100
    })
  }

  goTop() {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }
}
