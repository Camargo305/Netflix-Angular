import { Component, computed, HostListener, inject } from '@angular/core';
import { MoviesService } from './movies.service';
import { RouterLink } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../models/movie.interface';

@Component({
  selector: 'app-movies',
  imports: [RouterLink, MovieCardComponent, CommonModule],
  templateUrl: './movies.component.html',
})
export class MoviesComponent {

  isLoading = computed(() => this._moviesService.isLoading())//el computed nos permite crear una signal a partir de otra signal.
  hasMorePages = computed(() => this._moviesService.hasMorePages())

  private readonly _moviesService = inject(MoviesService);

  movies = this._moviesService.movies;

  //vamos a controlar la paginación
  @HostListener('window:scroll') //hostlistener escucha eventos y estamos escuchando el evento del objeto window, el scroll
  onScroll(): void {
    if(this.isLoading() || !this.hasMorePages()) return;
    const scrollPosition = window.innerHeight + window.scrollY // con innerheinght da altura visible de lo que contiene nuestra ventana y el scrollY los px que ha recorrido de scroll desde su desplazamiento
    const scrollThreshold = document.documentElement.scrollHeight; 

    if(scrollPosition >= scrollThreshold) { //si hemos llegado al final de la pagina volvemos a llamar a getMovies.
      this._moviesService.getMovies()
    }
  }

  addToFavorites(movie: Movie): void {
    this._moviesService.addFavorite(movie);
    movie.isFavorite = true;  // Marcar como favorito
  }

  isFavorite(movie: Movie): boolean {
    return this._moviesService.getFavorites().some((fav) => fav.id === movie.id);
  }
  removeFromFavorites(movie: Movie): void {
    this._moviesService.removeFavorite(movie);
    movie.isFavorite = false;  // Desmarcar como favorito
  }
}
