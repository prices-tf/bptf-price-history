import { History } from '../entities/history.entity';

export type HistoryInterval = History & {
  populated?: boolean;
};
