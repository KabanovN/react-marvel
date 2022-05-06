import useHttp from '../hooks/http.hook';

function useMarvelService() {
    const API_KEY = '43b852b655d1649e827e3c167cb36de9'; //при скрытии в .env => undefined
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _baseCharOffset = 210;
    const _baseComicsOffset = 10;

    const { request, error, loading, clearError } = useHttp();

    //методы для трансформации данных из полученного объекта - вычленяем нужные данные в новый объект
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

    const _transformComics = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            descr: comic.description || 'There is no description',
            img: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
            price: comic.prices.price
                ? `${comic.prices.price}$`
                : 'not available',
            pageCount: comic.pageCount || 'no info about the number of pages',
            language: comic.textObjects.language || 'en-us',
        };
    };

    const getAllCharacters = async (offset = _baseCharOffset) => {
        const res = await request(
            `${_apiBase}characters?limit=9&offset=${offset}&apikey=${API_KEY}`
        );
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(
            `${_apiBase}characters/${id}?apikey=${API_KEY}`
        );
        return _transformCharacter(res.data.results[0]);
    };

    const getComicsList = async (offset = _baseComicsOffset) => {
        const res = await request(
            `${_apiBase}comics?limit=8&offset=${offset}&apikey=${API_KEY}`
        );

        return res.data.results.map(_transformComics);
    };

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?apikey=${API_KEY}`);
        return _transformComics(res.data.results[0]);
    };

    return {
        getAllCharacters,
        getCharacter,
        getComicsList,
        getComic,
        loading,
        error,
        clearError,
    };
}

export default useMarvelService;
