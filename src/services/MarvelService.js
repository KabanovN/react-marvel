import useHttp from '../hooks/http.hook';

function useMarvelService() {
    const _apiKey = '43b852b655d1649e827e3c167cb36de9';
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _baseOffset = 210;

    const { request, error, loading, clearError } = useHttp();

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

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            descr: comics.description,
            img: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            price: comics.prices.price,
        };
    };

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(
            `${_apiBase}characters?limit=9&offset=${offset}&apikey=${_apiKey}`
        );
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(
            `${_apiBase}characters/${id}?apikey=${_apiKey}`
        );
        return _transformCharacter(res.data.results[0]);
    };

    const getComicsList = async (offset = 10) => {
        const res = await request(
            `${_apiBase}comics?limit=8&offset=${offset}&apikey=${_apiKey}`
        );

        return res.data.results.map(_transformComics);
    };

    return {
        getAllCharacters,
        getCharacter,
        getComicsList,
        loading,
        error,
        clearError,
    };
}

export default useMarvelService;
