import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesService } from '../../../features/movies/movies/movies.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Movie } from '../../../features/movies/models/movie.interface';
import { DatePipe } from '@angular/common';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-search',
  imports: [DatePipe],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  searchQuery = signal<string>('');

  private readonly _router = inject(Router);
  private readonly _moviesService = inject(MoviesService);
  private readonly _imageService = inject(SharedService);

  filteredMovies = rxResource({
    loader: () => this._moviesService.searchMovie(this.searchQuery()),
    request: this.searchQuery
    //request: () => this.searchQuery(),
  })

  // movies = computed(() => this.filteredMovies.value()?.results ??([] as Movie[]))
  movies = linkedSignal(() => this.filteredMovies.value()?.results ??([] as Movie[]))

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement
    this.searchQuery.set(input.value)
  }

  goToDetails(movieId: string): void {
    this._router.navigate(['/movies', movieId])
    this.clearQuery();
  } 

  clearQuery(): void {
    this.searchQuery.set('');
  }
  getImage(posterPath: string): string {
    return this._imageService.getImageUrl(posterPath)
  }
}
