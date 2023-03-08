import { Attendee } from './attendee';

export interface GlobalState {
  recipient?: Attendee;
  email?: string;
}
