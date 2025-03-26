import { Component, OnInit } from '@angular/core';
import { Movie } from '../models/movie.interface';
import { MoviesService } from '../movies/movies.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-list',
  imports: [CommonModule],
  templateUrl: './my-list.component.html',
})
export class MyListComponent implements OnInit {
  favorites: Movie[] = [];

  constructor(private movieService: MoviesService) {}

  ngOnInit(): void {
    this.favorites = this.movieService.getFavorites();
  }

  removeFromFavorites(movie: Movie): void {
    this.movieService.removeFavorite(movie);
    this.favorites = this.movieService.getFavorites();
  }

}
