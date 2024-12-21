import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  parseBasicToken(rawToken: string) {
    const [type, token] = rawToken.split(' ');

    if (type !== 'Basic') {
      throw new UnauthorizedException('Invalid token type');
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const tokenSplit = decoded.split(':');

    if (tokenSplit.length !== 2) {
      throw new UnauthorizedException('Invalid token format');
    }

    const [email, password] = tokenSplit;

    return { email, password };
  }

  async register(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hash = await bcrypt.hash(
      password,
      this.configService.get('HASH_ROUNDS'),
    );

    await this.userRepository.save({ email, password: hash });

    return await this.userRepository.findOne({ where: { email } });
  }
}
