import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ActivitiesModule } from './activities/activities.module';
import { ExternalApisModule } from './external-apis/external-apis.module';
import { PrismaModule } from './prisma/prisma.module';

import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [

    // Naudojami aplikacijos .ENV kintamieji
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),

    // Uzklausu ribojimo konfiguracija, apsauga nuo DDoS
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 100, // 100 requests per ttl value
    }]),
    FirebaseModule, 
    FavoritesModule, 
    ActivitiesModule, 
    ExternalApisModule, 
    PrismaModule
  ],
  controllers: [AppController],
  providers: [
    // Uzklausu ribojimo konfiguracijos pritaikymas
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService
  ],
})
export class AppModule {}
