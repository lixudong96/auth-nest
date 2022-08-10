import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { HttpModule, HttpService } from '@nestjs/axios';
import { LoggingAxiosInterceptor } from './common/axios.interceptor';

@Global()
@Module({
  imports: [
    HttpModule.register({}),
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: '',
      },
    }),
    CatsModule,
  ],
  controllers: [AppController],
  providers: [LoggingAxiosInterceptor, AppService],
  exports: [HttpModule],
})
export class AppModule {}
