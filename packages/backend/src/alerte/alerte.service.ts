import { Injectable,Logger } from '@nestjs/common';
import { CreateAlerteDto } from './dto/create-alerte.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class AlerteService {
    private readonly logger = new Logger(AlerteService.name);
    
      constructor(private readonly elasticsearchService: ElasticsearchService) {}
    
    
      async create(createAlerteDto: CreateAlerteDto) {
        const indexName = `alertes`;
    
        try {
          await this.elasticsearchService.index({
            index: indexName,
            body: {
              ...createAlerteDto,
            },
          });
          return { status: 'ok', message: 'alerte indexed' };
        } catch (error) {
          this.logger.error('Error indexing alerte to Elasticsearch', error);
          // Fallback or error handling
          throw new Error('Failed to index Alerte');
        }
      }
    
      async findAll() {
          this.logger.log(`Fetching all alertes from Elasticsearch`);
          
          const query: any ={ match_all: {} };
      
          try {
            const result = await this.elasticsearchService.search({
              index: 'alertes',
              query: query,
              //_source:['name'],
              size: 1000,
            });
            const Apps=result.hits.hits.map((hit:any) =>({id:hit._id,name:hit._source.name}) );
            console.log (Apps);
            return Apps;
          } catch (error) {
            this.logger.error('Failed to fetch alerte from Elasticsearch', error);
            return [];
          }
        }
}
