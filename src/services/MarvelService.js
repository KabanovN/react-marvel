const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
const _apiKey = 'apikey=43b852b655d1649e827e3c167cb36de9';
const _baseOffset = 210;

const getResources = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
        throw new Error(`status: ${res.status}`);
    }

    return await res.json();
};

//метод для трансформации данных из полученного объекта - вычленяем нужные данные в новый объект
const _transformCharacter = (char) => {
    return {
        id: char.id,
        name: char.name,
        description: char.description
            ? `${char.description.slice(0, 220)}...`
            : 'You can learn more information on Homepage or Wiki',
        thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
        homepage: char.urls[0].url,
        wiki: char.urls[1].url,
        comics: char.comics.items,
    };
};

const getAllCharacters = async (offset = _baseOffset) => {
    const res = await getResources(
        `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
};

const getCharacter = async (id) => {
    const res = await getResources(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
};

export { getAllCharacters, getCharacter };
