import userService from "../user/userService";

export const validateProfile = async (profileId: string): Promise<string | null> => {
    const userId = await userService.getUserIdByProfileId(profileId);
    if (!userId) {
        return null;
    }
    return userId;
};