import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService,private readonly configService:ConfigService) {}

  async create(createUserDto: CreateUserDto) {
    const indexName = `users-${createUserDto.role}`;
    console.log(indexName);
    const hash=await bcrypt.hash(createUserDto.password,10);
    createUserDto.password=hash;

    try {
      await this.elasticsearchService.index({
        index: indexName,
        body: {
          ...createUserDto,
          timestamp: new Date(),
        },
      });  console.log(indexName);
      return { status: 'ok', message: 'user indexed' };
    } catch (error) {
      this.logger.error('Error indexing user to Elasticsearch', error);
      throw new Error('Failed to index user');
    }
  }


  async findAll(username?: string) {
    this.logger.log(`Fetching all Users from Elasticsearch`);
    
    const query: any =username ? { match: { username } } : { match_all: {} };

    try {
      const result = await this.elasticsearchService.search({
        index: 'users-*',
        query: query,
        sort: 'timestamp:desc',
        size: 100,
      });

      return result.hits.hits.map((hit: any) => ({id:hit._id,...(hit._source)}));
    } catch (error) {
      this.logger.error('Failed to fetch users from Elasticsearch', error);
      return [];
    }
  }

  async findAllAdmin() :Promise<string[]>{
      this.logger.log(`Fetching all Users from Elasticsearch`);
      
      const query: any ={ match_all: {} };
  
      try {
        const result = await this.elasticsearchService.search({
          index: 'users-admin',
          query: query,
          _source:['email'],
        });
  
        return result.hits.hits.map((hit) => hit._source) as string[];
      } catch (error) {
        this.logger.error('Failed to fetch users from Elasticsearch', error);
        return [];
      }
    }
    
  async update(documentId:string,document:any){
    try {
      await this.elasticsearchService.update({
        index:'users-*',
        id:documentId,
        body:{doc:document}
      });
      return 'document mis à jour avec succes';
    } catch (error) {
     this.logger.error('failed to update user',error);
     return 'echec de la mis à jour';
    }
  }
}