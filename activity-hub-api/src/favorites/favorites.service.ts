import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
    constructor (private prisma: PrismaService) {}

    // Defines the 'create' method called by the controller
    async create(firebaseUid: string, createFavoriteDto: CreateFavoriteDto) {
        console.log(`Creating favorite for user ${firebaseUid}`);
        return this.prisma.favoritePlace.create({
            data: {
                firebaseUid,
                ...createFavoriteDto,
            },
        });
    }

    // Defines the 'findAll' method called by the controller
    async findAll(firebaseUid: string, placeType?: string) {
        console.log(`Finding all favorites for user ${firebaseUid}`);
        return this.prisma.favoritePlace.findMany({
            where: { firebaseUid,
                ...(placeType && { placeType }),
            },
            orderBy: { savedAt: 'desc' },
        });
    }

    // Defines the 'remove' method called by the controller
    async remove(firebaseUid: string, id: string) {
        console.log(`Removing favorite ${id} for user ${firebaseUid}`);

        const favorite = await this.prisma.favoritePlace.findFirst({
            where: { id: Number(id), firebaseUid }
        });
        if (!favorite) {
            throw new Error('Favorite not found or does not belong to user');
        }
        return this.prisma.favoritePlace.delete({
            where: { id: Number(id) },
        });
    }
}
