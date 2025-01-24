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
import { NoteDetailsService } from 'src/services/noteDetails.service';

@ApiTags('Notes Detail')
@Controller('note-details')
export class NoteDetailsController {
  constructor(private readonly noteDetailsService: NoteDetailsService) {}

  @Get()
  @UseGuards(AuthMiddleware)
  async getAll(@Query() query: QueryDto) {
    return this.noteDetailsService.getAll(query);
  }

  @Post()
  @UseGuards(AuthMiddleware)
  async created(@Req() req, @Body() payload: CNoteDetailsDto) {
    return this.noteDetailsService.created(payload, req.user);
  }

  @Put()
  @UseGuards(AuthMiddleware)
  async updated(@Req() req, @Body() payload: UNoteDetailsDto) {
    return this.noteDetailsService.updated(payload, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthMiddleware)
  async deleted(
    @Req() req,
    @Param('id') id: number,
    @Query('noteId') noteId: string,
  ) {
    return this.noteDetailsService.deleted({ id, noteId }, req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthMiddleware)
  async get(@Param('id') id: number, @Query('noteId') noteId: string) {
    return this.noteDetailsService.findById({ id, noteId });
  }
}
