import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';

@Injectable()
export class MovieService {
  private movies: Movie[] = [];
  private idCounter = 3;

  constructor() {
    const movie1 = new Movie();
    movie1.id = 1;
    movie1.title = 'Inception';
    movie1.genre = 'Action';

    const movie2 = new Movie();
    movie2.id = 2;
    movie2.title = 'Interstellar';
    movie2.genre = 'Science Fiction';

    this.movies.push(movie1, movie2);
  }

  getManyMovies(title?: string) {
    if (title) {
      return this.movies.filter((movie) => movie.title.includes(title));
    }

    return this.movies;
  }

  getMovieById(id: number) {
    const movie = this.movies.find((movie) => movie.id === +id);

    if (!movie) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }
    return movie;
  }

  createMovie(createMovieDto: CreateMovieDto) {
    const movie = {
      id: this.idCounter++,
      ...createMovieDto,
      // 임시코드
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    this.movies.push(movie);

    return movie;
  }

  updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = this.movies.find((movie) => movie.id === +id);

    if (!movie) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }

    Object.assign(movie, updateMovieDto);

    return movie;
  }

  deleteMovie(id: number) {
    const movieIndex = this.movies.findIndex((movie) => movie.id === +id);

    if (movieIndex === -1) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }

    this.movies.splice(movieIndex, 1);

    return id;
  }
}
