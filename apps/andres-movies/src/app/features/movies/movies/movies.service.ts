import { inject, Injectable, signal } from "@angular/core";
import { Movie, MovieResponse } from "../models/movie.interface";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class MoviesService{
    movies = signal<Movie[]>([]);
    trendingMovies = signal<Movie[]>([]);
    selectedMovie = signal<Movie | null>(null);//puede ser una peli o nulo

    //creamos una propiedad para la pagina actual
    currentPage = signal<number>(1);
    hasMorePages = signal<boolean>(true);
    isLoading = signal<boolean>(false);

    private readonly _apiKey = 'f3f1b1fa96abb5ef8febee52b6cd1834';
    private readonly _apiUrl = 'https://api.themoviedb.org/3';
    private readonly _serchTerm = signal<string>('');

    private readonly _http = inject(HttpClient);

    constructor() {
        this.getMovies();
        this.getTrending();
    }

    getMoviesById(movieId: string ): Observable<Movie> {
        return this._http.get<Movie>(`${this._apiUrl}/movie/${movieId}?api_key=${this._apiKey}`)
    }

    getMovies(): void {
        this._http
        .get<MovieResponse>(
            `${this._apiUrl}/movie/popular?api_key=${this._apiKey}&page=${this.currentPage()}`
        ).subscribe((response) => {
            const currentMovies = this.movies();//almacenamos las peliculas actuales que tenemos
            this.movies.set([...currentMovies, ...response.results]); //concatenamos el currentMovies mas el resultado que tenemos
            this.hasMorePages.set(response.page < response.total_pages);
            this.currentPage.update((currentPage) => currentPage + 1);
            this.isLoading.set(false);
        })
    }

    getRandomInt(min=0, max=50): number {
        return Math.floor(Math.random() * (max - min)) + min 
    }

    setRandomMovie() {
        const randomIndex = this.getRandomInt();
        const randomMovie = this.trendingMovies()[randomIndex];
        this.selectedMovie.set(randomMovie)
    }

    getTrending(): void {
        this._http
        .get<MovieResponse>(
            `${this._apiUrl}/trending/movie/day?api_key=${this._apiKey}`
        ).subscribe((movies: MovieResponse) => {
            this.trendingMovies.set(movies.results);
            this.setRandomMovie();
        })
    }

    searchMovie(query: string): Observable<MovieResponse> {
        return this._http.get<MovieResponse>(`${this._apiUrl}/search/movie?api_key=${this._apiKey}&query=${query}`);
    }
    
    getFavorites(): Movie[] {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
    }
    
    addFavorite(movie: Movie): void {
        const favorites = this.getFavorites();
        if (!favorites.some((fav) => fav.id === movie.id)) {
            favorites.push(movie);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }
    
    removeFavorite(movie: Movie): void {
        const favorites = this.getFavorites().filter((fav) => fav.id !== movie.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}