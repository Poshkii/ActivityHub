import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ExternalApisModule } from '../external-apis/external-apis.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
    imports: [ExternalApisModule, FirebaseModule], 
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
})
export class ActivitiesModule {}