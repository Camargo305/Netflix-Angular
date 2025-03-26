import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Movie } from '../../features/movies/models/movie.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  movie = input.required<Movie>();
  
}
