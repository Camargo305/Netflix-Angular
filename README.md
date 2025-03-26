1.- Creamos el proyecto: npx create-nx-workspace andres-movies --preset=angular
2.- cd nombre-proyecto
3.- hacemos esto para instalar la dependencia tailwind: npx nx g @nx/angular:setup-tailwind
4.- La tailwind.config.js lo dejamos tal que así: theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'netflix-black': '#1A1F2C',
        'netflix-gray': '#564d4d',
        'netflix-red-dark': '#b81d24',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [],
};

5.- Arrancamos proyecto: nx serve andres-movies
6.-Creamos la carpeta features, layout y shared dentro de src/app.
7.-Dentro de la carpeta features creamos una carpeta movies y dentro de ella estas 4 carpetas: models, movie-card, movie-details, movie-row. Tambien creamos un componente dentro de la carpeta movies, llamada movies: nx g component movies --project=andres-movies y dentro de este componente creamos un movies.service.ts y un movies.routes.ts.

8.-Configuramos las rutas en el movies.routes.ts: import { Routes } from "@angular/router";
import { MoviesComponent } from "./movies.component";

const MoviesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'movies', 
        pathMatch: 'full',
    },
    {
        path: 'movies',
        loadComponent: () => import('./movies.component').then((m) => m.MoviesComponent),
    },
    {
        path: ':movieId',
        loadComponent: () => import('./movie-detail/movie-detail.component').then((m) => m.MoviesDetailComponent),
    }
];

export {MoviesRoutes};

9.- y en el app.route ponemos lo siguiente: import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
        path: '',
        redirectTo: 'movies', 
        pathMatch: 'full',
    },
    {   //nos llevamos el archivo de moviesroute
        path: '',
        loadChildren: () => import('./features/movies/movies/movies.route').then((m) => m.MoviesRoutes),
    }, 
    {
        path: '**', //cuando nos venga cualquier ruta
        redirectTo: 'movies', //redirigir a movies
        pathMatch: 'full',
    }
];

10.- Creamos el componente movies-details: nx g c movies-details.

11.- hacemos esto en el movie-details.ts:  movieId!: string; 

  constructor(private  route: ActivatedRoute){}

  ngOnInit(): void {
      this.movieId = this.route.snapshot.paramMap.get('id') || '';
  } y en el html ponemos: <p>{{movieId}}</p>.
12.- Nos vamos al app.config.ts: añadimos esto:  withComponentInputBinding() en el providerRouter.

13.- En app.component.ts importamos el RouterOutlet que es con el que queremos trabajar.

14.- Creamos un archivo y metemos el json de las peliculas de themoviedb.org. OPCIONAL, es mas facil así el siguiente paso.

15.- en models, creamos la interface Movie: export interface Movie {
    id: string,
    title: string,
    poster: string,
    backdrop: string,
    genre_ids: number[],
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    release_date: string,
    vote_average: number,
    vote_count: number
}
export interface MovieResponse { //en el json si cierran todos los resultados queda esto, pues esto es otra interface
    page: number,
    result: Movie[],
    total_pages: number,
    total_results: number
}

16.- Nos centramos en el movies.service.ts que es el que nos va a dejar hablar con la API. Creamos lo siguiente: movies = signal<Movie[]>([]);
    trendingMovies = signal<Movie[]>([]); selectedMovie = signal<Movie | null>(null);//puede ser una peli o nulo
    y declaramos estas constantes:  private readonly _apiKey = 'f3f1b1fa96abb5ef8febee52b6cd1834';
    private readonly _apiUrl = 'https://api.themoviedb.org/3';
    private readonly _serchTerm = signal<string>('');

    private readonly _http = inject(HttpClient);

17.- Hacemos la obtención de peliculas de la url: getMoviesById(movieId: string ){
        return this._http.get<MovieResponse>(`${this._apiUrl}/movie/${movieId}?api_key=${this._apiKey}`)
    } 
    y un 
    getMovies(): void {
        this._http
        .get<MovieResponse>(
            `${this._apiUrl}/movie/popular?api_key=${this._apiKey}`
        ).subscribe((response) => {
            this.movies.set(response.result)
        })
    }

Despues de las constantes se añade esto: constructor() {
        this.getMovies();
    } y llamamos al getMovies.

18.- Nos vamos al app.config y hacemos lo siguiente, añadimos provideHttpClient(withFetch()), debajo de lo ultimo añadido.

19.- Nos vamos a movies.component.ts e inyectamos el Service:   private readonly _moviesService = inject(MoviesService); 
readonly movies = this._moviesService.movies;
 y hacemos el scroll: //vamos a controlar la paginación
  @HostListener('window:scroll') //hostlistener escucha eventos y estamos escuchando el evento del objeto window, el scroll
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY // con innerheinght da altura visible de lo que contiene nuestra ventana y el scrollY los px que ha recorrido de scroll desde su desplazamiento
    const scrollThreshold = document.documentElement.scrollHeight; 

    if(scrollPosition >= scrollThreshold) { //si hemos llegado al final de la pagina volvemos a llamar a getMovies.
      this._moviesService.getMovies()
    }
  }
20.- Creamos en el movie.service: //creamos una propiedad para la pagina actual
    currentPage = signal<number>(1);
    hasMorePages = signal<boolean>(true);
    isLoading = signal<boolean>(false);
21.- En movie.service modificamos el subscribe y ponemos: .subscribe((response) => {
            const currentMovies = this.movies();//almacenamos las peliculas actuales que tenemos
            this.movies.set([...currentMovies, ...response.results]) //concatenamos el currentMovies mas el resultado que tenemos. Crea un nuevo array con las películas actuales y las nuevas
            this.hasMorePages.set(response.page < response.total_pages);
            this.currentPage.update((currentPage) => currentPage + 1);
            this.isLoading.set(false);
        }) 

22.- Volvemos al movie.component.ts y creamos esto: isLoading = computed(() => this._moviesService.isLoading())//el computed nos permite crear una signal a partir de otra signal.
  hasMorePages = computed(() => this._moviesService.hasMorePages())
   y dentro del OnScroll en lo alto del todo ponemos esto: if(this.isLoading() || !this.hasMorePages()) return;

Ya tenemos el movies listo.

23.-Nos vamos al app.html y empezamos a contruir: <div class="relative min-h-screen">
    <main>
        <div class="pb-20">
            <router-outlet></router-outlet>
        </div>
    </main>
</div>

24.-Nos vamos al movies.component.html: <pre>
    {{movies() | json}}
</pre> esto es para ver que se muestran las peliculas.
y en el movie.component.ts incorporamos el jsonPipe para que no se queje y ahora empezamos a maquetar el movies.component.html: <div class="grid grid-cols-2 gap-4 px-4 mx-auto mt-6 m-10 md:grid-cols-4 lg:grid-cols-4">
    @for (movie of movies(); track $index) {
        <a [routerLink]="['/movies', movie.id]" class="relative group">
            <app-movie-card [movie]="movie" class="w-full" />
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
                <h3 class="font-semibold text-xl">{{ movie.title }}</h3>
                <div class="flex space-x-4 justify-center mt-4">
                    <button class="p-2 rounded-md bg-white/20 hover:bg-white/40">
                        ▶ Reproducir
                    </button>
                    <button class="p-2 rounded-md bg-white/20 hover:bg-white/40">
                        ℹ Más información
                    </button>
                </div>
            </div>
        </a>
    }
</div>

25.- Sustituimos en jsonPipe por RouterLink en el movie.component.ts, y añadimos el CardComponent de movie-card.

En el movie-card.component.ts añadimos: movie = input.required<Movie>();, y le importamos jsonPipe y añadimos un template y le ponemos esto: imports: [JsonPipe],
  template: `<p>{{movie() | json}}</p>` y despues de esto sustituimos lo de dentro del template,{{movie() | json}} por esto: <div class="cursor-pointer" role="button">
    <img [src]="getImageUrl()" (error)="setImageError(true)" [alt]="movie().title" class="aspect-[2/3]">
    <div class="movie-card-overlay">
      <div class="movie-card-content">
        <h3 class="mb-2 text-lg font-bold">
          {{movie().title}}
        </h3>
        <p class="text-sm text-gray-300 line-clamp-2">
          {{movie().overview}}
        </p>
      </div>
    </div>
  </div> y estamos a falta de crear el getImageUrl() y el setImageError.

  En el mismo archivo creamos en la clase de debajo una constante: imageError = false; y debajo de eso creamos : getImageUrl(): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500'
    return this.imageError ? '/placeholder.svg' : `${baseUrl}/${this.movie().poster_path}`
  }

  setImageError(value:boolean): void {
    this.imageError = value; //le vamos a setear el valor que recibamos
  }

26.- Nos vamos al app.html y hacemos lo siguiente: <button (click)="goTop()"
        class="fixed p-3 text-white transition-all duration-300 rounded shadow-lg bg-netflix-red bottom-8 right-8 hover:bg-netflix-red-dark"
        [class.opacity-0]="!showButton" [class.opacity-100]="showButton">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
    </button> ponemos un boton debajo del main
27.- Creamos el goTop en el app.component.ts: goTop() {
    window.scrollTo({top: 0, behavior: 'smooth'})
  } y junto a esto creamos tambien esto porque sino no se ve el boton: showButton = false; //no se muestra el boton de normal

  constructor() {
    window.addEventListener('scroll', () => { // cuando hacemos scroll y superamos los 100 aparece
      this.showButton = window.scrollY > 100
    })
  }

Para la section de Hero lo que vamos a hacer es lo siguiente: nx g c hero en la carpeta layout.

28.- En el hero.component.ts hacemos lo siguiente: movie = input.required<Movie>();
29.- Nos vamos al html de hero y empezamos a maquetar: @let movieData = movie(); //declaramos la variable movie y le pasamos las peliculas en este archivo. y realizamos esto para mostrar la peli: @if(movieData) {
    <div class="relative h-[80vh] w-full">
        <div class="absolute inset-0">
            <img src="http://image.tmdb.org/t/p/w500{{movieData.backdrop_path}}" alt="{{movieData.title}}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent">
        </div>
            <div class="relative flex items-center h-full">
                <div class="w-full px-4 md:px-16 md:2/3 lg:w-1/2">
                    <h1 class="mb-4 text-3xl font-bold text-white md:text-5xl">{{movieData.title}}</h1>
                    <p class="mb-8 text-lg text-white">{{movieData.overview}}</p>
                </div>
            </div>
        </div>
    </div>
}

30.- Llevamos el html de hero.html al app.html y para eso hay que incorporar en el html el <app-hero> y en el app.ts el HeroComponent.
31.- A la etiqueta <app-hero> hay que pasarle el selectedMovies por props y para eso el app.ts tiene que tener el valor de selectedMovies que está en el movies.service.ts. Hay que pasar eso así: private readonly _moviesService = inject(MoviesService);
  heroMovie = this._moviesService.selectedMovie y la etiqueta quedaria así: <app-hero [movie]="heroMovie()!" EL SIGNO DE EXCLAMACION ES PARA QUE NO DE ERROR EL [movie] que seria null.

32.- Nos vamos a MovieService y le vamos a decir que elija el ID de una peli aleatoria. Hacemos una funcion que elija un numero aleatorio, se la pasamos al trendingMovies que son las peliculas aleatorias que van a salir, y despues hay que hacer una funcion para obtener esas peliculas como el getMovies: getRandomInt(min=0, max=50): number {
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
    }.
    El getTrending se añade al constructor.

33.- Ahora vamos aocn el navbar. Hacemos en layout: nx g c navbar.
34.- Nos vamos al html de navbar y maquetamos. Importamos routerLink en navbar.ts y en el html: <nav class="fixed top-0 z-50 w-full bg-gradient-to-b from-black to-transparent">
    <div class="px-4 py-4 md:px-10">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <img src="https://www.flaticon.es/iconos-gratis/pelicula" alt="Movie app" class="h-8" />
                <div class="hidden ml-8 space-x-4 md:flex">
                    <a [routerLink]="['/']" routerLinkActivate="!text.netflix-red" [routerLinkActiveOptions]="{exact: true}" class="text-white transition-colors hover:text-netflix-gray">Home</a> <!-- Esto: [routerLinkActiveOptions]="{exact: true}" es para que cuando estamos en Movies y se pone rojo movie para que no se ponga tambien Home -->
                    <a [routerLink]="['/movies']" routerLinkActivate="!text.netflix-red" class="text-white transition-colors hover:text-netflix-gray">Movies</a>
                    <a [routerLink]="['/my-list']" routerLinkActivate="!text-netflix-red" class="text-white transition-colors hover:text-netflix-gray">My List</a>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative">
                    <!-- Search Component -->
                </div>
            </div>
        </div>
    </div>
</nav>
e importamos el <app-navbar> "NavbarComponent" en el app.html.
35.- Creamos dentro de navbar un componente search.
36.-Nos vamos al search.ts y ponemos la variable:   searchQuery = signal<string>('');

37.- En movies.service creamos este metodo: searchMovie(query: string): Observable<MovieResponse> {
        return this._http.get<MovieResponse>(`${this._apiUrl}/search/movie?api_key=${this._apiKey}&query=${query}`);
    }
38.-Importamos esto en search.ts: import { rxResource } from '@angular/core/rxjs-interop' y hacemos lo siguiente: searchQuery = signal<string>('');

  private readonly _router = inject(Router);
  private readonly _moviesService = inject(MoviesService);

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

  goToDetails(movieId: number): void {
    this._router.navigate(['/movies', movieId])
    this.clearQuery();
  } 

  clearQuery(): void {
    this.searchQuery.set('');
  }
  los metodos los hemos empezado de abajo hacia arriba. Todo esto es para el buscador.

39.- Ahora lo que tenemos que hacer es irnos al search.html: <div class="relative search-container">
    <input type="text" class="py-2 pl-4 text-white border border-gray-700 rounded-md w-80 bg-black/60 focus:outline-none focus:border-white" placeholder="Search for a movie" (input)="onSearchInput($event)" /> <!--Cada vez que esto cambie llamamos a onSearchInput-->
    <ul class="absolute z-50 w-full mt-2 rounded-md shadow-lg search-results bg-black">
        @for (movie of movies(); track movie.id) {
            <!-- El tabindex es para que no se queje y el keyup.center es para cuando le demos enter que tambien nos lleve a los detalles de la pelicula. -->
            <li tabindex="0" (click)="goToDetails(movie.id)" (keyup.enter)="goToDetails(movie.id)" class="flex items-center p-2 rounded-md hover:bg-netflix-red/20 cursor-pointer">
            <img [src]="getImage(movie)" alt="{{movie.title}} poster" class="w-12 h-12 mr-2">
                <span>{{movie.title}} - {{movie.release_date | date: 'yyyy'}}</span>
            </li>
        }
    </ul>
</div>
40.- Nos llevamos al <app-search> al navbar y incorporamos el SearchComponent.
41.- Hacemos en el search.ts: getImage(posterPath: string): string {
    return posterPath ? 'https://image.tmdb.org/t/p/w500' + posterPath : '../../../assets/logo.png';
  } para recibir la imagen tambien al buscar.
42.- Ahora vamos a hacer el movie-details cada vez que seleccionamos una pelicula.
43.- Maquetamos el movie-details en el html: <div class="min-h-screen p-4 md:p-8">
    <div class="min-h-screen p-4 md:p-8">
    <div class="max-w-4xl mx-auto mt-12">
        <button (click)="goBack()" class="flex items-center gap-2 mb-8 transition-color text-netflix-red hover:text-netflix-red/80">
            Go Back
        </button>
        @if (movie.hasValue()) {
            @let movieData = movie.value();
            <div class="grid gap-8 mt-12 md:grid-cols-2">
                <img [src]="'https://image.tmdb.org/t/p/w500' + movieData?.poster_path " [alt]="movieData?.title" class="w-full rounde-lg">
            </div>
        }
        
    </div>
</div> y ahora vamos al movie-details.ts y hacemos el goback y que aparezca la pelicula: private readonly _route = inject(Router);
  private readonly _moviesService = inject(MoviesService);

  movie = rxResource({
    request: this.movieId,
    loader: () => this._moviesService.getMoviesById(this.movieId())
    
  })

  goBack(): void {
    this._route.navigate(['..'])//esto es ir a la ruta anterior.
  }
44.- Cambiamos el getMovieById de MovieRespones a Movie.
45.- Seguimos maquetando el movie-details.html. El IF tiene que quedar así: @if (movie.hasValue()) {
            @let movieData = movie.value();
            <div class="grid gap-8 mt-12 md:grid-cols-2">
                <img [src]="'https://image.tmdb.org/t/p/w500' + movieData?.poster_path " [alt]="movieData?.title" class="w-full rounde-lg">
                <div>
                    <h1 class="mb-4 text-4xl font-bold">
                        {{movieData?.title}}
                    </h1>
                    <p class="mb-4 text-gray-300">{{movieData?.overview}}</p>
                    <div class="space-y-2">
                        <p>
                            <span class="font-bold">
                                Release Date: 
                            </span>
                            {{ movieData?.release_date | date }} /10
                        </p>
                        <p>
                            <span class="font-bold">
                                Release Date: 
                            </span>
                            {{ movieData?.vote_average | number: '1.1-1' }}
                        </p>
                    </div>
                </div>
            </div>
        }
46.- Vamos a añadirle un div y 2 botones al hero(imagen grande que aparece arriba).Hemos añadido la parte comentada: @let movieData = movie();

@if(movieData) {
    <div class="relative h-[80vh] w-full">
        <div class="absolute inset-0">
            <img [src]="'http://image.tmdb.org/t/p/w500' + movieData.backdrop_path" alt="{{movieData.title}}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        </div>
        
        <!-- Contenedor con posición absoluta para que se ubique encima de la imagen -->
        <div class="absolute top-10 mt-10 left-0 w-full px-4 md:px-16 lg:w-1/2">
            <h1 class="text-3xl mb-10 font-bold text-white md:text-5xl">{{movieData.title}}</h1>
            <p class="mb-8 text-lg text-white">{{movieData.overview}}</p>
            <!-- <div class="flex space-x-4">
                <button class="px-8 py-2 text-black bg-white rounded hover:bg-white/90">
                    ▶ Reproducir
                </button>
                <button class="px-8 py-2 text-white bg-gray-500/70 rounded hover:bg-gray-500/50">
                    ℹ Mas información
                </button>
            </div> -->
        </div>
    </div>
}

47.- Nos vamos a la carpeta shared que creamos y hacemos lo siguiente: nx g s shared. Hacemos lo siguiente: private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  private readonly DEFAULT_POSTER_PATH = '/assets/logo.png';
  private readonly BACKDROP_PATH = '/assets/logo.png';

  getImageUrl(posterPath: string | null, type: 'poster' | 'backdrop' = 'poster'): string {
    if(!posterPath) {
      return type === 'poster' ? this.DEFAULT_POSTER_PATH : this.BACKDROP_PATH
    }
    return `${this.IMAGE_BASE_URL}${posterPath}
    }`
  } ESTO ES PARA USARLO EN TODOS LOS SITIOS DONDE USAMOS LA CARGA DE IMAGENES. el getImageUrl. quedaria así:   private readonly _imageService = inject(SharedService);
  getImageUrl(): string {
    const posterPath = this.movie().poster_path;
    return this._imageService.getImageUrl(posterPath)
  }
48.- Para hacer que carguen las peliculas solo cuando el scroll llega se hace esto con @defer y @placeholder: @defer (on viewport) {
    <div class="grid grid-cols-2 gap-4 px-4 mx-auto mt-6 m-10 md:grid-cols-4 lg:grid-cols-4">
        @for (movie of movies(); track $index) {
            <a [routerLink]="['/movies', movie.id]" class="relative group">
                <app-movie-card [movie]="movie" class="w-full" />
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center text-white opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
                    <h3 class="font-semibold text-xl">{{ movie.title }}</h3>
                    <div class="flex space-x-4 justify-center mt-4">
                        <button class="p-2 rounded-md bg-white/20 hover:bg-white/40">
                            ▶ Reproducir
                        </button>
                        <button class="p-2 rounded-md bg-white/20 hover:bg-white/40">
                            ℹ Más información
                        </button>
                    </div>
                </div>
            </a>
        }
    </div>
}
@placeholder {
    <div class="flex justify-center p-4">
        <div class="w-8 h-8 border-b-2 border-white rounded-full animate-spin">

        </div>
    </div>
}