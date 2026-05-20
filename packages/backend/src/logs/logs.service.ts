import { Injectable, Logger } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { sendMailDto } from 'src/mail/dto/mail.dto';
import { ApplicationsService } from 'src/application/application.service';
import { RegleAppService } from 'src/regle-alerte/regle-app.service';
import { RegleService } from 'src/regle/regle.service';
import { isEmpty } from 'class-validator';
import { AlerteService } from 'src/alerte/alerte.service';
import { CreateAlerteDto } from 'src/alerte/dto/create-alerte.dto';

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService,private readonly alerteService: AlerteService,private readonly regleService: RegleService,private readonly applicationService: ApplicationsService,private readonly mailService:MailService,private readonly userService:UsersService,private readonly regleAppService:RegleAppService) {}
    

  async create(createLogDto: CreateLogDto) {
    
    const indexName = `logs`;
    try {
     let listApp= await this.applicationService.findAll();
     const {level,application}=createLogDto;
     const app=(listApp.filter((log=>log.name.toLowerCase()===application.toLowerCase()))).map(log=>log.id);
     if(app.length==0)
      throw new Error("L'application source n'est pas valide");
    createLogDto.application=app[app.length-1];
      await this.elasticsearchService.index({
        index: indexName,
        body: {
          ...createLogDto,
          //timestamp: new Date(),
          status:'en cours',
        },
      });
//creation du tableau des id des regles associée a l'application qui sont dans l'etat actif
      let regleApp=(await this.regleAppService.findAll()).filter(regApp=>regApp.application===app[app.length-1] && regApp.etat==='actif');
//continuons s'il en existe
      if(regleApp.length>0){
        const regles=await this.regleService.findAll();
        for (let index = 0; index < regleApp.length; index++) {
          const element = regleApp[index];
//rechercher le niveau que contient la regle
          let levelRegle=(regles.filter(reg=>reg.level.toLowerCase()===level.toLowerCase()));
          if(!isEmpty(levelRegle)){
            const users=await this.userService.findAll();
            const AdminEmail:Record<string,string>={};
            users.forEach(user => {
              if(user.role==='admin' && user.etat==='actif')
                AdminEmail[user.prenom]=user.email;
            });
            const admins=Object.keys(AdminEmail);
            const mailAdmins=admins.map((user)=>AdminEmail[user]);
            if(admins.length!=0){
              const dto:sendMailDto={
              recipients:mailAdmins,
              subject: 'log critique',
              html: '<p>un log provenant de {application} et de niveau {level}</p>',
            };
            this.mailService.sendMail(dto);
        }
            await this.alerteService.create(new CreateAlerteDto(new Date()));
          }
          
        }
      }
      return { status: 'ok', message: 'Log indexed'};
    } catch (error) {
      this.logger.error('Error indexing log to Elasticsearch', error);
      // Fallback or error handling
      throw new Error('Failed to index log');
    }
  }

  async findAll(level?: string) {
    this.logger.log(`Fetching logs from Elasticsearch with level: ${level || 'all'}`);
    
    const query: any = level ? { match: { level } } : { match_all: {} };

    try {
      const result = await this.elasticsearchService.search({
        index: `logs`,
        query: query,
        sort: 'timestamp:desc',
        size: 1000,
      });

      return result.hits.hits.map((hit:any) => ({id:hit._id,...(hit._source)}));
    } catch (error) {
      this.logger.error('Failed to fetch logs from Elasticsearch', error);
      return [];
    }
  }

  async findAllApplication() {
      this.logger.log(`Fetching all applications from Elasticsearch`);
      
      const query: any ={ match_all: {} };
  
      try {
        const result = await this.elasticsearchService.search({
          index: `logs`,
          query: query,
          _source:['application'],
          size: 1000,
        });
        const Apps=result.hits.hits.map((hit) => hit._source);
  console.log(Apps.map((app :any)=> app.application));
        return Apps.map((app :any)=> app.application);
      } catch (error) {
        this.logger.error('Failed to fetch application from Elasticsearch', error);
        return [];
      }
    }

  async update(documentId:string,document:any){
    try {
      await this.elasticsearchService.update({
        index:`logs`,
        id:documentId,
        body:{doc:document}
      });
      return 'document mis à jour avec succes';
    } catch (error) {
     this.logger.error('failed to update log',error);
     return 'echec de la mis à jour';
    }
  }
}
