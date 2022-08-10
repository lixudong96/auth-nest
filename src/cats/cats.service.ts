import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { map } from 'rxjs';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class CatsService {
  constructor(
    private readonly http: HttpService,
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
  ) {}
  create(createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  async findAll() {
    const data = await this.http.get<any>('http://localhost:4000/user');
    return data.pipe(
      map((data) => {
        this.redis.set('uuid', data.data.data);
        return data.data;
      }),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }

  async testRedis() {
    return await this.redis.set('123', '345');
  }
}
