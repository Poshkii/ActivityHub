import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation  } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(AuthGuard) 
@Controller('favorites')
export class FavoritesController {
    constructor(private favoritesService: FavoritesService) {}

    @Post()
    @ApiOperation({ summary: 'Save a favorite place' })
    create(@Req() req, @Body() CreateFavoriteDto: CreateFavoriteDto) {
        return this.favoritesService.create(req.user.uid, CreateFavoriteDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user favorites' })
    findAll(@Req() req) {
        return this.favoritesService.findAll(req.user.uid);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a favorite' })
    remove(@Req() req, @Param('id') id: string) {
        return this.favoritesService.remove(req.user.uid, id);
    }
}
