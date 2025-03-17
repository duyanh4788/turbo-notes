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

  async deleteData(index: string, id: string) {
    const checkExits = await this.elasticsearchService.exists({
      index,
      id,
    });
    if (!checkExits) return false;
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

  async search(index: TableName, query: string): Promise<SearchHit<unknown>[]> {
    try {
      const fields = this.getSearchFields(index);

      const response = await this.elasticsearchService.search({
        index,
        body: {
          query: {
            multi_match: {
              query,
              fields,
              type: 'cross_fields',
              operator: 'or',
              minimum_should_match: '50%',
            },
          },
        },
      });

      return response.hits.hits;
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  private getSearchFields(index: TableName): string[] {
    switch (index) {
      case TableName.NOTES:
        return ['label^2'];
      case TableName.NOTE_DETAILS:
        return ['content^2'];
      default:
        return ['content'];
    }
  }
}
