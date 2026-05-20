import { Injectable, Logger } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}


  async create(createApplicationDto: CreateApplicationDto) {
    const indexName = `applications`;

    try {
      await this.elasticsearchService.index({
        index: indexName,
        body: {
          ...createApplicationDto,
        },
      });
      return { status: 'ok', message: 'Application indexed' };
    } catch (error) {
      this.logger.error('Error indexing application to Elasticsearch', error);
      // Fallback or error handling
      throw new Error('Failed to index application');
    }
  }

  async findAll() {
      this.logger.log(`Fetching all applications from Elasticsearch`);
      
      const query: any ={ match_all: {} };
  
      try {
        const result = await this.elasticsearchService.search({
          index: 'applications',
          query: query,
          //_source:['name'],
          size: 1000,
        });
        const Apps=result.hits.hits.map((hit:any) =>({id:hit._id,name:hit._source.name}) );
        console.log (Apps);
        return Apps;
      } catch (error) {
        this.logger.error('Failed to fetch application from Elasticsearch', error);
        return [];
      }
    }

}
