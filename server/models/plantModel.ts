//const API_KEY = 'sk-cPs166f55590d72357015'; //change to your API key
//const API_KEY = 'sk-oqF366f96d7b858e57046'; //change to your API key
//const API_KEY = 'sk-nubU66f96ebfc123b7048'; //change to your API key
//const API_KEY = 'sk-eq1J66f98ad25fe9f7050'; //change to your API key
//const API_KEY = 'sk-UQ5B67039d8a080357150'; //change to your API key
const API_KEY = 'sk-Zplm670e2e9e8972b7258'; //change to your API key

const baseUrl = 'https://perenual.com/api/'


// Plant class to model plant data and behavior
class Plant {
    name: string;
    lastWatered: string;
    waterFrequency: string;
    imageURL: string;
    imageBlob: Blob | null;

    constructor(name: string, lastWatered: string, waterFrequency: string, imageURL: string, imageBlob: Blob | null = null) {
        this.name = name;
        this.lastWatered = lastWatered;
        this.waterFrequency = waterFrequency;
        this.imageURL = imageURL;
        this.imageBlob = imageBlob;
    }

    // TODO method for scheduling watering
}


//returns a list of plants matching the search phrase
export async function searchSpecies(searchPhrase: string): Promise<any> {
    console.log(`${baseUrl}species-list?key=${API_KEY}&page=1&q=${searchPhrase}`);
    const response = await fetch(`${baseUrl}species-list?key=${API_KEY}&page=1&q=${searchPhrase}`);

    if (!response.ok) {
        throw new Error('Failed to fetch species data from API');
    }

    const json = await response.json();
    return json.data;
}


//Get a list of species
export async function getSpeciesList(page: number): Promise<any> {
    const response = await fetch(`${baseUrl}species-list?key=${API_KEY}&page=${page}`);

    if (!response.ok) {
        throw new Error('Failed to fetch species list');
    }

    const json = await response.json();
    return json.data;
}

//Get care advice for plants
//All plants cannot be found
export async function getCareAdvice(searchPhrase?: string, speciesId?: string): Promise<any> {
    if (!searchPhrase && !speciesId) {
        throw new Error('Missing parameter');
    }
    let response;
    if (searchPhrase) {
        response = await fetch(`${baseUrl}species-care-guide-list?key=${API_KEY}&q=${searchPhrase}`);
    } else {
        response = await fetch(`${baseUrl}species-care-guide-list?key=${API_KEY}&species_id=${speciesId}`);
    }

    if (!response.ok) {
        throw new Error('Failed to fetch care advice');
    }

    const json = await response.json();
    return json.data;
}

//not working
export async function getHardinessMap(speciesId: number): Promise<any> {
    const response = await fetch(`${baseUrl}hardiness-map?key=${API_KEY}&species_id=1&page=1`);

    if (!response.ok) {
        throw new Error('Failed to fetch hardiness map');
    }

    const json = await response.json();
    return json.data;
}

export async function getFAQ(): Promise<any> {
    const response = await fetch(`${baseUrl}article-faq-list?key=${API_KEY}&page=1`);

    if (!response.ok) {
        throw new Error('Failed to fetch FAQ');
    }

    const json = await response.json();
    return json.data;
}

export async function getPlantDiseaseList(searchPhrase?: string): Promise<any> {
    let response;
    if (searchPhrase) {
        response = await fetch(`${baseUrl}pest-disease-list?key=${API_KEY}&page=1&q=${searchPhrase}`);
    } else {
        response = await fetch(`${baseUrl}pest-disease-list?key=${API_KEY}&page=1`);
    }

    if (!response.ok) {
        throw new Error('Failed to fetch plant disease list');
    }

    const json = await response.json();
    return json.data;
}






