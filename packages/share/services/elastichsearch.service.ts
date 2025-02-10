import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';
import { TableName } from 'packages/common/constant';

@Injectable()
export class ElasticsearchService {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private readonly elasticsearchService: NestElasticsearchService) {}

  async createIndex(index: string) {
    return await this.elasticsearchService.indices.create({ index });
  }

  async indexData(index: string, id: string, body: any) {
    return await this.elasticsearchService.index({
      index,
      id,
      body,
    });
  }

  async search(index: TableName, query: string): Promise<SearchHit<unknown>[]> {
    try {
      const matchQuery = this.configQuery(index, query);
      const response = await this.elasticsearchService.search({
        index,
        body: {
          query: {
            wildcard: matchQuery,
          },
        },
      });

      return response.hits.hits;
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async deleteData(index: string, id: string) {
    return await this.elasticsearchService.delete({
      index,
      id,
    });
  }

  async getAllData(index: string) {
    try {
      const response = await this.elasticsearchService.search({
        index,
        body: {
          query: {
            match_all: {},
          },
        },
      });

      return response.hits.hits;
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  private configQuery(index: TableName, query: string) {
    const newQuery = {
      value: `*${query}*`,
      rewrite: 'constant_score',
    };
    switch (index) {
      case TableName.NOTES:
        return { label: newQuery };
      case TableName.NOTE_DETAILS:
        return { content: newQuery };
      default:
        return { label: newQuery };
    }
  }
}
