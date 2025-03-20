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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';
import { NoteDetailsService } from 'src/services/noteDetails.service';
import {
  CNoteDetailsDto,
  QueryDto,
  UNoteDetailsDto,
} from '../DTO/noteDetails.dto';
import { SearchDto } from '../DTO/paging.dto';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('Notes Detail')
@Controller('note-details')
export class NoteDetailsController {
  constructor(private readonly noteDetailsService: NoteDetailsService) {}

  @Get('/search')
  @UseGuards(AuthMiddleware)
  async search(@Req() req, @Query() query: SearchDto) {
    return this.noteDetailsService.searchs(req.user.id, query.text);
  }

  @Post('/upload-file')
  @UseGuards(AuthMiddleware)
  @UseInterceptors(
    FileInterceptor('upload', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile() file,
    @Body('noteId') noteId: string,
    @Req() req,
  ) {
    return await this.noteDetailsService.uploadFile(req.user.id, noteId, file);
  }

  @Get('/file/:id')
  @UseGuards(AuthMiddleware)
  async getFile(
    @Req() req,
    @Param('id') id: number,
    @Query('noteId') noteId: string,
  ) {
    return this.noteDetailsService.getFile(req.user.id, { id, noteId });
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
