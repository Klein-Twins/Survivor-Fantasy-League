import { Transaction } from 'sequelize';
import { Transactional } from '../repositoriesBackup/utils/Transactional';

export interface DomainModel<TAttributes, TDTO = void, DTOParams = void> {
  save(...args: any[]): Promise<void>;
  toDTO(params: DTOParams): TDTO;
  // Static method to create an instance from database attributes
  fromAttributes?: (attributes: TAttributes, ...args: any[]) => any;
}
