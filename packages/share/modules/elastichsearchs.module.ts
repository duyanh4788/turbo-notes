// elasticsearch/elasticsearch.module.ts
import { Module } from '@nestjs/common';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';
import { config } from 'packages/config';
import { ElasticsearchService } from '../services/elastichsearch.service';

@Module({
  imports: [
    NestElasticsearchModule.register({
      node: config.ELAST.HOST,
      auth: {
        username: config.ELAST.USERNAME,
        password: config.ELAST.PASSWORD,
      },
    }),
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModules {}
