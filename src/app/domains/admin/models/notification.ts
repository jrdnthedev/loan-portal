import { NotificationType } from './notification-type.enum';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  createdAt: string;
}
