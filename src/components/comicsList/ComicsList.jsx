import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/marvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

function ComicsList() {
    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(10);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(null);

    const { getComicsList, loading, error } = useMarvelService();

    const handleRequestComics = (offset, initial = false) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getComicsList(offset).then(handleComicsLoaded);
    };

    const handleComicsLoaded = (newComics) => {
        newComics.length < 8 ? setComicsEnded(true) : setComicsEnded(false);

        setComicsList([...comicsList, ...newComics]);
        setOffset((prevOffset) => prevOffset + 8);
        setNewComicsLoading(false);
    };

    const renderComicsList = (comics) => {
        const itemsList = comics.map((item, i) => {
            return (
                <li className='comics__item' key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img
                            src={item.img}
                            alt={item.title}
                            className='comics__item-img'
                            style={{
                                objectFit: item.img.includes(
                                    'image_not_available'
                                )
                                    ? 'contain'
                                    : 'cover',
                            }}
                        />
                        <div className='comics__item-name'>{item.title}</div>
                        <div className='comics__item-price'>
                            Price: {item.price}
                        </div>
                    </Link>
                </li>
            );
        });

        return <ul className='comics__grid'>{itemsList}</ul>;
    };

    useEffect(() => {
        handleRequestComics(offset, true);
        //eslint-disable-next-line
    }, []);

    return (
        <div className='comics__list'>
            {loading && !newComicsLoading ? (
                <Spinner />
            ) : !error ? (
                renderComicsList(comicsList)
            ) : (
                <ErrorMessage />
            )}
            <button
                className='button button__main button__long'
                onClick={() => handleRequestComics(offset)}
                disabled={newComicsLoading}
                style={{ display: comicsEnded ? 'none' : 'block' }}>
                <div className='inner'>load more</div>
            </button>
        </div>
    );
}

export default ComicsList;
