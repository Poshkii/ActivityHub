import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { FirebaseModule } from '../firebase/firebase.module'; 
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [FirebaseModule, PrismaModule],
  providers: [FavoritesService],
  controllers: [FavoritesController]
})
export class FavoritesModule {}
