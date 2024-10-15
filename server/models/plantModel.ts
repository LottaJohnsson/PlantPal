require('dotenv').config();
const API_KEY = process.env.PERENUAL_API_KEY; //change to your API key
import axios from "axios";
const baseUrl = 'https://perenual.com/api/'

const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 3000,
});


//returns a list of plants matching the search phrase
export async function searchSpecies(searchPhrase: string): Promise<any> {
    return axiosInstance.get(`species-list?key=${API_KEY}&page=1&q=${searchPhrase}`);
}

export async function getCareAdvice(searchPhrase?: string, speciesId?: string): Promise<any> {
    if (searchPhrase) {
        return axiosInstance.get(`species-care-guide-list?key=${API_KEY}&q=${searchPhrase}`);
    } else {
        return axiosInstance.get(`species-care-guide-list?key=${API_KEY}&species_id=${speciesId}`);
    }

}










