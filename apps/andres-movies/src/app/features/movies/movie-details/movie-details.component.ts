import { Component, inject, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../movies/movies.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Movie } from '../models/movie.interface';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent {
  @Input() movieId!: string;

  private readonly _route = inject(Router);
  private readonly _moviesService = inject(MoviesService);

  movie = rxResource({
    request: () => this.movieId,
    loader: () => this._moviesService.getMoviesById(this.movieId)
  });

  goBack(): void {
    this._route.navigate(['..']);
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
