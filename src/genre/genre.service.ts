import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  create(createGenreDto: CreateGenreDto) {
    return this.genreRepository.save(createGenreDto);
  }

  findAll() {
    return this.genreRepository.find();
  }

  findOne(id: number) {
    return this.genreRepository.findOne({ where: { id } });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    await this.genreRepository.update(id, updateGenreDto);
    const updatedGenre = await this.genreRepository.findOne({ where: { id } });

    return updatedGenre;
  }

  async remove(id: number) {
    const genre = await this.findOne(id);

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    await this.genreRepository.delete(id);

    return genre.id;
  }
}
