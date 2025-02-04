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
import { ApiTags } from '@nestjs/swagger';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';
import {
  CNoteDetailsDto,
  QueryDto,
  UNoteDetailsDto,
} from 'src/common/DTO/noteDetails.dto';
import { SearchDto } from 'src/common/DTO/paging.dto';
import { NoteDetailsService } from 'src/services/noteDetails.service';

@ApiTags('Notes Detail')
@Controller('note-details')
export class NoteDetailsController {
  constructor(private readonly noteDetailsService: NoteDetailsService) {}

  @Get('/search')
  @UseGuards(AuthMiddleware)
  async search(@Req() req, @Query() query: SearchDto) {
    return this.noteDetailsService.searchs(req.user.id, query.text);
  }

  @Get()
  @UseGuards(AuthMiddleware)
  async getAll(@Req() req, @Query() query: QueryDto) {
    return this.noteDetailsService.getAll(req.user.id, query);
  }

  @Post()
  @UseGuards(AuthMiddleware)
  async created(@Req() req, @Body() payload: CNoteDetailsDto) {
    return this.noteDetailsService.created(req.user, payload);
  }

  @Put()
  @UseGuards(AuthMiddleware)
  async updated(@Req() req, @Body() payload: UNoteDetailsDto) {
    return this.noteDetailsService.updated(req.user, payload);
  }

  @Delete(':id')
  @UseGuards(AuthMiddleware)
  async deleted(
    @Req() req,
    @Param('id') id: number,
    @Query('noteId') noteId: string,
  ) {
    return this.noteDetailsService.deleted(req.user.id, { id, noteId });
  }

  @Get(':id')
  @UseGuards(AuthMiddleware)
  async get(
    @Req() req,
    @Param('id') id: number,
    @Query('noteId') noteId: string,
  ) {
    return this.noteDetailsService.findById(req.user.id, { id, noteId });
  }
}
