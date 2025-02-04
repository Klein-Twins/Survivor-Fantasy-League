import { LeagueAttributes } from '../../models/league/League';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import { ProfileAttributes } from '../../models/account/Profile';
import { UserAttributes } from '../../models/account/User';

export enum ProfileSearchSortBy {
  FirstName = 'firstName',
  LastName = 'lastName',
  UserName = '$User.userName$',
  UpdatedAt = 'UPDATED_AT',
}

export enum ProfileSearchSortDirection {
  Ascending = 'ASC',
  Descending = 'DESC',
}
