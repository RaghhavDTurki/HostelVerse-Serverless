import axios from "axios";

const MAP_QUEST_KEY = process.env.MAP_QUEST_KEY;
const college_location = "26.9124, 75.7873";
export async function getDistance(location: string): Promise<number> {
    // const query_url = `http://www.mapquestapi.com/directions/v2/route?key=${MAP_QUEST_KEY}&unit=k&from=${location}&to=${college_location}`;
    const query_url = `http://www.mapquestapi.com/directions/v2/route?key=${MAP_QUEST_KEY}&from=${location}&to=${college_location}`;
    // console.log(query_url);
    const distance = (await axios.get(query_url)).data;
    // console.log(distance);
    const answer = distance.route.distance;
    return answer;
}