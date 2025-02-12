import { NodeMailerService } from 'src/services/nodeMailer.service';
import { NoteDetailsListenerService } from 'src/services/noteDetailsListener.service';
import { NoteDetailsPubSubService } from 'src/services/noteDetailsPubSubService';
import { NoteDetailQueueTTLService } from 'src/services/noteDetailsQueueTTL.service';
import { RabbitService } from 'src/services/rabbit.service';

export const servicesProvider = [
  RabbitService,
  NoteDetailsListenerService,
  NoteDetailQueueTTLService,
  NoteDetailsPubSubService,
  NodeMailerService,
];
