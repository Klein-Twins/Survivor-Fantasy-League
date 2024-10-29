export default async function getSurvivorCast() {
    const response = await fetch('http://localhost:4343/api/survivorCastList');
    const responseData = await response.json();
    if(!response.ok) {
        throw new Error("Failed to fetch survivor cast list.");
    }
    console.log("responseData = ", responseData);
    return responseData.data;
}