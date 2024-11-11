export interface CreateLeagueFormData {
    name: string;
    seasonId: string;
}

export const validateCreateLeague = (values: CreateLeagueFormData) => {
    const errors: Partial<Record<keyof CreateLeagueFormData, string>> = {};
    if (!values.seasonId) {
        errors.seasonId = "Please enter a valid season";
    }
    if (!values.name) {
        errors.name = "Please enter a valid name"
    }

    return errors;
};