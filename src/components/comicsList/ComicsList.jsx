import { useState, useEffect } from 'react';
import useMarvelService from '../../services/marvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

function ComicsList() {
    const [comicsList, setComicsList] = useState([]);
    const { getComicsList, loading, error } = useMarvelService();

    useEffect(() => {
        getComicsList().then((comics) => setComicsList(comics));
        //eslint-disable-next-line
    }, []);

    const renderComicsList = (comics) => {
        const itemsList = comics.map((item) => {
            return (
                <li className='comics__item' key={item.id}>
                    <a href='#!'>
                        <img
                            src={item.img}
                            alt={item.title}
                            className='comics__item-img'
                        />
                        <div className='comics__item-name'>{item.title}</div>
                        <div className='comics__item-price'>{item.price}$</div>
                    </a>
                </li>
            );
        });

        return <ul className='comics__grid'>{itemsList}</ul>;
    };

    return (
        <div className='comics__list'>
            {loading ? (
                <Spinner />
            ) : !error ? (
                renderComicsList(comicsList)
            ) : (
                <ErrorMessage />
            )}
            <button className='button button__main button__long'>
                <div className='inner'>load more</div>
            </button>
        </div>
    );
}

export default ComicsList;
