import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieDetail } from './entity/movie-detail.entiy';
import { Movie } from './entity/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
  ) {}

  findAll(title?: string) {
    if (!title) {
      return this.movieRepository.find();
    }

    return this.movieRepository.find({ where: { title: Like(`%${title}%`) } });
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const movieDetail = await this.movieDetailRepository.save({
      detail: createMovieDto.detail,
    });

    const movie = await this.movieRepository.save({
      ...createMovieDto,
      detail: movieDetail,
    });

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }

    const { detail, ...movieRest } = updateMovieDto;

    await this.movieRepository.update({ id }, movieRest);

    if (detail) {
      await this.movieDetailRepository.update(
        { id: movie.detail.id },
        { detail },
      );
    }

    const newMovie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });

    return newMovie;
  }

  async remove(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }

    await this.movieRepository.delete({ id });
    await this.movieDetailRepository.delete({ id: movie.detail.id });

    return id;
  }
}
