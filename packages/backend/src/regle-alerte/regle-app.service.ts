import { Injectable, Logger } from '@nestjs/common';
import { CreateRegleAppDto } from './dto/create-regleApp.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ApplicationsService } from 'src/application/application.service';
import { RegleService } from 'src/regle/regle.service';

@Injectable()
export class RegleAppService {
  private readonly logger = new Logger(RegleAppService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService,private readonly applicationsService:ApplicationsService,private readonly regleService:RegleService) {}

  async create(createRegleAppDto: CreateRegleAppDto) {
    const indexName = `regles-apps`;
   
    try {
         let apps=await this.applicationsService.findAll();
        let regles=await this.regleService.findAll();
        const {regle,application}=createRegleAppDto;
        const app= (apps.filter(appli=> appli.name.toLowerCase()===application)).map(appli=>appli.id);
        const regl=(regles.filter((reg=>reg.level.toLowerCase()===regle.toLowerCase()))).map(reg=>reg.id);
     if(app.length==0)
      throw new Error("L'application source n'est pas valide");
    if(regl.length==0)
      throw new Error("La regle n'est pas prise en compte");
    createRegleAppDto.application=app[app.length-1];
    createRegleAppDto.regle=regl[regl.length-1];
      await this.elasticsearchService.index({
        index: indexName,
        body: {
          ...createRegleAppDto,
          timestamp: new Date(),
          etat:'actif',
        },
      });
      return { status: 'ok', message: 'regle-application indexed' };
    } catch (error) {
      this.logger.error('Error indexing regle-application to Elasticsearch', error);
      throw new Error('Failed to index regle-application');
    }
  }


  async findAll(application?:string) {
    this.logger.log(`Fetching all regle-application from Elasticsearch`);
    const query: any = application ? { match: { application } } : { match_all: {} };

    try {
      const result = await this.elasticsearchService.search({
        index: 'regles-apps',
        query: query,
        sort: 'timestamp:desc',
        size: 100,
      });

      return result.hits.hits.map((hit:any) => ({id:hit._id,regle:hit._source.regle,application:hit._source.application,etat:hit._source.etat}));
    } catch (error) {
      this.logger.error('Failed to fetch regle-application from Elasticsearch', error);
      return [];
    }
  }

  async update(createRegleAppDto: CreateRegleAppDto, id:string) {
    const indexName = `regles-apps`;

    try {
        let apps = await this.applicationsService.findAll();
        let regles = await this.regleService.findAll();
        const { regle, application,etat } = createRegleAppDto; // Assurez-vous d'inclure l'ID pour la mise à jour

        const app = apps.filter(appli => appli.name.toLowerCase() === application).map(appli => appli.id);
        const regl = regles.filter(reg => reg.level.toLowerCase() === regle.toLowerCase()).map(reg => reg.id);

        if (app.length === 0) {
            throw new Error("L'application source n'est pas valide");
        }
        if (regl.length === 0) {
            throw new Error("La règle n'est pas prise en compte");
        }

        // Préparez les champs mis à jour
        const updatedFields = {
            application: app[app.length - 1],
            regle: regl[regl.length - 1],
            timestamp: new Date(),
            etat: etat,
        };

       try{ // Mettez à jour le document dans Elasticsearch
        await this.elasticsearchService.update({
            index: indexName,
            id: id, // ID du document à mettre à jour
            body: {
                doc: updatedFields,
            },
        });}catch(err){
          this.create(createRegleAppDto);
        }

        return { status: 'ok', message: 'regle-application updated' };
    } catch (error) {
        this.logger.error('Error updating regle-application in Elasticsearch', error);
        throw new Error('Failed to update regle-application');
    }
}
   
}