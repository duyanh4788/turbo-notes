import { NotesDetailsRepository } from 'src/repository/noteDetails.repository';
import { NotesRepository } from 'src/repository/notes.repository';

export const repositoryProvider = [NotesRepository, NotesDetailsRepository];
