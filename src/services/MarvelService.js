class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=43b852b655d1649e827e3c167cb36de9';

    getResources = async(url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = () => {
        return this.getResources(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }

    getCharacter = (id) => {
        return this.getResources(`${this._apiBase}characters/${id}?${this._apiKey}`);
    }
}

export default MarvelService;