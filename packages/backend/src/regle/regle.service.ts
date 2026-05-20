import { Injectable, Logger } from '@nestjs/common';
import { CreateRegleDto } from './dto/create-regle.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegleService  {
  private readonly logger = new Logger(RegleService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService,private readonly configService:ConfigService) {}

  async create(createRegleDto: CreateRegleDto) {
    const indexName = `regles`;

    try {
      await this.elasticsearchService.index({
        index: indexName,
        body: {
          ...createRegleDto,
          timestamp: new Date(),
        },
      });
      return { status: 'ok', message: 'regle indexed' };
    } catch (error) {
      this.logger.error('Error indexing regle to Elasticsearch', error);
      throw new Error('Failed to index regle');
    }
  }


  async findAll() {
    this.logger.log(`Fetching all regles from Elasticsearch`);
    
    const query: any ={ match_all: {} };

    try {
      const result = await this.elasticsearchService.search({
        index: 'regles',
        query: query,
        sort: 'timestamp:desc',
        size: 100,
      });

      return result.hits.hits.map((hit:any) => ({id:hit._id,level:hit._source.level,description:hit._source.description}));
    } catch (error) {
      this.logger.error('Failed to fetch regles from Elasticsearch', error);
      return [];
    }
  }

   
}