SELECT 
    Profile.PROFILE_ID AS profileId,
    Profile.FIRST_NAME AS firstName,
    Profile.LAST_NAME AS lastName,
    Profile.IMAGE_URL AS imageUrl,
    Profile.UPDATED_AT AS updatedAt,
    User.USER_NAME AS userName,
    leagueProfiles.INVITE_STATUS AS inviteStatus
FROM PRF_PROFILE AS Profile
INNER JOIN USR_USERS AS User
    ON Profile.PROFILE_ID = User.USER_PROFILE_ID
LEFT OUTER JOIN LGE_LEAGUES_PROFILES AS leagueProfiles
    ON Profile.PROFILE_ID = leagueProfiles.PROFILE_ID
    AND leagueProfiles.LEAGUE_ID = :leagueId
WHERE 
    Profile.FIRST_NAME ILIKE :firstName
    AND User.USER_NAME ILIKE :userName
ORDER BY 
    User.USER_NAME ASC
LIMIT :limit OFFSET :offset;