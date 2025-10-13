import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ActivitiesService } from './activities.service';
import { ActivityQueryDto } from './dto/activity-query.dto';

@ApiTags('activities')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('activities')
export class ActivitiesController {
    constructor(
        private activitiesService: ActivitiesService,
    ) {}

    @Get('all')
    @ApiOperation({ summary: 'Get all activities for a city' })
    getAllActivities(@Query() query: ActivityQueryDto) {
        return this.activitiesService.getAllActivities(query.city);
    }

    @Get('recommendations')
    @ApiOperation({ summary: 'Get weather-based recommendations' })
    getRecommendations(@Query('city') city: string = 'Vilnius') {
        return this.activitiesService.getWeatherBasedRecommendations(city);
    }
}