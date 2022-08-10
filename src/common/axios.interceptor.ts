import { Injectable, Logger } from '@nestjs/common';
import type { AxiosRequestConfig } from 'axios';
import {
  AxiosInterceptor,
  AxiosFulfilledInterceptor,
  AxiosRejectedInterceptor,
  AxiosResponseCustomConfig,
} from '@narando/nest-axios-interceptor';
import { HttpService } from '@nestjs/axios';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

// logging.axios-interceptor.ts
const LOGGING_CONFIG_KEY = Symbol('kLoggingAxiosInterceptor');

// Merging our custom properties with the base config
interface LoggingConfig extends AxiosRequestConfig {
  [LOGGING_CONFIG_KEY]: {
    startTime: number;
  };
}

@Injectable()
export class LoggingAxiosInterceptor extends AxiosInterceptor<LoggingConfig> {
  constructor(
    httpService: HttpService,
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
  ) {
    super(httpService);
  }

  requestFulfilled(): AxiosFulfilledInterceptor<LoggingConfig> {
    return (config) => {
      config[LOGGING_CONFIG_KEY] = {
        startTime: Date.now(),
      };
      return config;
    };
  }
  // requestRejected(): AxiosRejectedInterceptor {}
  responseFulfilled(): AxiosFulfilledInterceptor<
    AxiosResponseCustomConfig<LoggingConfig>
  > {
    return async (res) => {
      const startTime = res.config[LOGGING_CONFIG_KEY].startTime;
      const endTime = Date.now();
      const duration = endTime - startTime;
      const log = `axios调用接口路由:${res.config.url};请求时间: ${duration}ms`;
      const value = await this.redis.get('uuid');
      console.log(value);
      Logger.debug(log);
      return res;
    };
  }
}
