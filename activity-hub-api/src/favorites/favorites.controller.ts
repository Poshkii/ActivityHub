import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(AuthGuard) // ← Protects all routes with Firebase auth
@Controller('favorites')
export class FavoritesController {
    constructor(private favoritesService: FavoritesService) {}

    @Post()
    create(@Req() req, @Body() CreateFavoriteDto: CreateFavoriteDto) {
        return this.favoritesService.create(req.user.uid, CreateFavoriteDto);
    }

    @Get()
    findAll(@Req() req) {
        return this.favoritesService.findAll(req.user.uid);
    }

    @Delete(':id')
    remove(@Req() requestAnimationFrame, @Param('id') id: string) {
        return this.favoritesService.remove(requestAnimationFrame.user.uid, id);
    }
}
