export const formatEmail = (email : any) : string => {
    if(!email) {
        return "";
    }
    return email.toString().toLowerCase();
}