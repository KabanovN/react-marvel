class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=43b852b655d1649e827e3c167cb36de9';
    _baseOffset = 210;

    getResources = async(url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`status: ${res.status}`);
        }

        return await res.json();
    }

    //метод для трансформации данных из полученного объекта - вычленяем нужные данные в новый объект
    _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 220)}...` : 'You can learn more information on Homepage or Wiki',
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResources(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResources(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

}

export default MarvelService;