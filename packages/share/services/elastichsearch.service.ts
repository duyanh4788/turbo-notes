import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';
import { IndexSearch } from 'packages/common/constant';

@Injectable()
export class ElasticsearchService {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private readonly elasticsearchService: NestElasticsearchService) {}

  async createIndex(index: string) {
    try {
      return this.elasticsearchService.indices.create({ index });
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  async indexData(index: string, id: string, body: any) {
    try {
      return this.elasticsearchService.index({
        index,
        id,
        body,
      });
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  async search(index: IndexSearch, query: string): Promise<SearchHit<unknown>[]> {
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
    try {
      return this.elasticsearchService.delete({
        index,
        id,
      });
    } catch (error) {
      Logger.error(error);
      return null;
    }
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

  private configQuery(index: IndexSearch, query: string) {
    const newQuery = {
      value: `*${query}*`,
      rewrite: 'constant_score',
    };
    switch (index) {
      case IndexSearch.NOTES:
        return { label: newQuery };
      case IndexSearch.NOTE_DETAILS:
        return { content: newQuery };
      default:
        return { label: newQuery };
    }
  }
}
