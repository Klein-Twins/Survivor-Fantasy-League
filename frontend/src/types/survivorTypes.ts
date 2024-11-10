export interface SurvivorDetails {
    survivorId: string;
    firstName: string;
    lastName: string;
    fromCity: string | null;
    fromState: string;
    fromCountry: string;
    nickName: string | null;
    seasonId: number;
    originalTribeId: string | null;
    age: number;
    description: string;
    job: string;
    imageUrl: string;
}
export type SurvivorDetailsBySeasonResponseData = SurvivorDetails[];