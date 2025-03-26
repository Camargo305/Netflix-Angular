import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Movie } from '../models/movie.interface';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../shared/shared.service';
import { MoviesService } from '../movies/movies.service';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  template: `
  <div *ngIf="hasImage()">
    <div class="cursor-pointer movie-card" role="button">
      <img [src]="getImageUrl()" (error)="setImageError(true)" [alt]="movie.title" class="aspect-[2/3]">
      <div class="movie-card-overlay">
        <div class="movie-card-content">
          <h3 class="mb-2 text-lg font-bold">
            {{movie.title}}
          </h3>
          <p class="text-sm text-gray-300 line-clamp-2">
            {{movie.overview}}
          </p>
        </div>
      </div>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  imageError = false;

  private readonly _imageService = inject(SharedService);
  private readonly _moviesService = inject(MoviesService);

  hasImage(): boolean {
    return !!this.movie.poster_path && !this.imageError;
  }

  getImageUrl(): string {
    const posterPath = this.movie.poster_path;
    return this._imageService.getImageUrl(posterPath)
  }
  
  setImageError(value:boolean): void {
    this.imageError = value; //le vamos a setear el valor que recibamos
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