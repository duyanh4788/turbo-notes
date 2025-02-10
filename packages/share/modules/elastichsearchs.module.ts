// elasticsearch/elasticsearch.module.ts
import { Module } from '@nestjs/common';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';
import { config } from 'packages/config';
import { ElasticsearchService } from '../services/elastichsearch.service';

@Module({
  imports: [
    NestElasticsearchModule.register({
      node: config.ELASTIC.HOST,
      auth: {
        username: config.ELASTIC.USERNAME,
        password: config.ELASTIC.PASSWORD,
      },
    }),
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModules {}
