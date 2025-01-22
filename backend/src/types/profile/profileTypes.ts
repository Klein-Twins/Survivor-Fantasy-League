import { LeagueAttributes } from "../../models/League";
import { LeagueProfileAttributes } from "../../models/LeagueProfile";
import { ProfileAttributes } from "../../models/Profile";
import { UserAttributes } from "../../models/User";




export enum ProfileSearchSortBy {
    FirstName = 'firstName',
    LastName = 'lastName',
    UserName = '$User.userName$',
    UpdatedAt = 'UPDATED_AT',
}

export enum ProfileSearchSortDirection {
    Ascending = 'ASC',
    Descending = 'DESC'
}