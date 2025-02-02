import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { readdir, unlink } from 'fs/promises';
import { join, parse } from 'path';
import { Movie } from 'src/movie/entity/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  logEverySecond() {
    console.log('Every second!');
  }

  async calculateMovieLikeCounts() {
    await this.movieRepository.query(
      `
        UPDATE movie m SET "likeCount" = (
          SELECT COUNT(*) FROM movie_user_like mul
          WHERE m.id = mul."movieId" AND mul."isLike" = true
        )
      `,
    );

    await this.movieRepository.query(
      `
        UPDATE movie m SET "dislikeCount" = (
          SELECT COUNT(*) FROM movie_user_like mul
          WHERE m.id = mul."movieId" AND mul."isLike" = false
        )
      `,
    );
  }

  // @Cron('* * * * * *')
  async eraseOrphanFiles() {
    const files = await readdir(join(process.cwd(), 'public', 'temp'));

    const deleteFileTargets = files.filter((file) => {
      const filename = parse(file).name;

      const split = filename.split('_');

      if (split.length !== 2) {
        return true;
      }

      try {
        const date = +new Date(parseInt(split[split.length - 1]));
        const aDayInMilSec = 24 * 60 * 60 * 1000;

        const now = +new Date();

        return now - date > aDayInMilSec;
      } catch (error) {
        return false;
      }
    });

    await Promise.all(
      deleteFileTargets.map(async (file) => {
        await unlink(join(process.cwd(), 'public', 'temp', file));
      }),
    );
  }
}
