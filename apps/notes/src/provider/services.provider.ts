import { GCStorageService } from 'src/services/gcstorage.service';
import { NoteDetailsService } from 'src/services/noteDetails.service';
import { NotesService } from 'src/services/notes.service';

export const servicesProvider = [
  NotesService,
  NoteDetailsService,
  GCStorageService,
];
