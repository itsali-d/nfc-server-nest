import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrgUserService } from './org-user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrgUserDto, PaginationParams, UpdateOrgUserDto, LoginUserDto } from 'src/utils';
@ApiTags('Organization User')
@Controller('org-user')
export class OrgUserController {
    constructor(private readonly userService: OrgUserService) { }

    @ApiBearerAuth()
    @Post()
    @ApiOperation({
        summary: 'Create Organization User',
        description:
            'Token Auth needed for this request , so it means , the creator should have a token of admin role',
    })
    @UseGuards(AuthGuard('jwt'))
    create(@Body() createUserDto: CreateOrgUserDto, @Req() req: Request) {
        return this.userService.create(createUserDto, (req as any).user);
    }

    @Post('/login')
    @ApiOperation({
        summary: 'Login Organization User',
        description: 'Login to the dashboard for super-admin and admin role',
    })
    login(@Body() loginUserDto: LoginUserDto) {
        return this.userService.login(loginUserDto);
    }
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({
        summary: 'Get Organization User By Id',
        description: 'Get the user data using Id',
    })
    @UseGuards(AuthGuard('jwt'))
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @ApiBearerAuth()
    @ApiQuery({
        name: 'pageIndex',
        required: false,
    })
    @ApiQuery({
        name: 'pageSize',
        required: false,
    })
    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll(@Req() req: Request, @Query() paginationQuery: PaginationParams) {
        return this.userService.findAll(paginationQuery);
    }

    @ApiBearerAuth()
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateOrgUserDto,
        @Req() req: Request,
    ) {
        return this.userService.update(id, updateUserDto, (req as any)?.user);
    }

    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string, @Req() req: Request) {
        return this.userService.remove(id, (req as any).user);
    }
}
