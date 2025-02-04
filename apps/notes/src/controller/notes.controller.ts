import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';
import { ChildNotesDto, CNotesDto, UNotesDto } from 'src/common/DTO/notes.dto';
import { PagingDto, SearchDto } from 'src/common/DTO/paging.dto';
import { NotesService } from 'src/services/notes.service';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('/search')
  @UseGuards(AuthMiddleware)
  async search(@Req() req, @Query() query: SearchDto) {
    return this.notesService.searchs(req.user.id, query.text);
  }

  @Post('/child')
  @UseGuards(AuthMiddleware)
  async createdChild(@Req() req, @Body() payload: ChildNotesDto) {
    return this.notesService.createdChild(req.user.id, payload);
  }

  @Get()
  @UseGuards(AuthMiddleware)
  async getAll(@Req() req, @Query() query: PagingDto) {
    return this.notesService.getAll(req.user.id, query);
  }

  @Post()
  @UseGuards(AuthMiddleware)
  async created(@Req() req, @Body() payload: CNotesDto) {
    return this.notesService.created(req.user.id, payload);
  }

  @Put()
  @UseGuards(AuthMiddleware)
  async updated(@Req() req, @Body() payload: UNotesDto) {
    return this.notesService.updated(req.user.id, payload);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthMiddleware)
  async deleted(@Req() req, @Param() params: { id: string }) {
    return this.notesService.deleted(req.user.id, params.id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AuthMiddleware)
  async get(@Req() req, @Param() params: { id: string }) {
    return this.notesService.findById(req.user.id, params.id);
  }
}
