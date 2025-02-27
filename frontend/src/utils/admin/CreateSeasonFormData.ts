export interface CreateSeasonFormData {
  seasonNumber: number;
  seasonName?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  numberCastaways: number;
  theme?: string;
}

export interface CreateSeasonFormErrors {
  seasonNumber?: string;
  seasonName?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  numberCastaways?: string;
  theme?: string;
}
