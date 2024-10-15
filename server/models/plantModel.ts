//const API_KEY = 'sk-cPs166f55590d72357015'; //change to your API key
//const API_KEY = 'sk-oqF366f96d7b858e57046'; //change to your API key
//const API_KEY = 'sk-nubU66f96ebfc123b7048'; //change to your API key
//const API_KEY = 'sk-eq1J66f98ad25fe9f7050'; //change to your API key
//const API_KEY = 'sk-UQ5B67039d8a080357150'; //change to your API key
//const API_KEY = 'sk-UQ5B67039d8a080357150'; //change to your API key
//const API_KEY = 'sk-jlEU670e3f131fd967261'
const API_KEY = 'sk-1njU670e412597c8e7262';

import axios from "axios";
//const API_KEY = 'sk-kae2670640bf0a6d27184'; //change to your API key
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










