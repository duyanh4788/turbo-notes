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
      body: { content: body.content },
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
      let allHits = [];
      let response = await this.elasticsearchService.search({
        index,
        scroll: '2m',
        size: 1000,
        body: {
          query: {
            match_all: {},
          },
        },
      });

      while (response.hits.hits.length > 0) {
        allHits = allHits.concat(response.hits.hits);
        response = await this.elasticsearchService.scroll({
          scroll_id: response._scroll_id,
          scroll: '2m',
        });
      }

      return allHits;
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async search(index: TableName, query: string): Promise<{ id: string }[]> {
    try {
      const response = await this.elasticsearchService.search({
        index,
        size: 50,
        _source: ['id'],
        body: {
          query: {
            bool: {
              should: [
                { match: { content: { query, fuzziness: 'AUTO', prefix_length: 2 } } },
                { match_phrase: { content: query } },
                { prefix: { content: query } },
                { wildcard: { content: `${query}*` } },
              ],
              minimum_should_match: 1,
            },
          },
        },
      });

      return response.hits.hits.map((hit) => ({
        id: hit._id,
      }));
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }
}
