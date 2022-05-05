import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../services/marvelService';

import AppBanner from '../components/appBanner/AppBanner';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Spinner from '../components/spinner/Spinner';

import './singleComicPage.scss';

function SingleComicPage() {
    const [comic, setComic] = useState([]);
    const { comicId } = useParams();
    const { getComic, clearError, loading, error } = useMarvelService();

    const handleComicRequest = (id) => {
        getComic(id).then((comic) => setComic(comic));
        clearError();
    };

    useEffect(() => {
        handleComicRequest(comicId);
        // eslint-disable-next-line
    }, [comicId]);

    return (
        <>
            <AppBanner />
            {loading ? (
                <Spinner />
            ) : !error ? (
                <View comic={comic} />
            ) : (
                <ErrorMessage />
            )}
        </>
    );
}

const View = ({ comic }) => {
    return (
        <div className='single-comic'>
            <img
                src={comic.img}
                alt={comic.title}
                className='single-comic__img'
            />
            <div className='single-comic__info'>
                <h2 className='single-comic__name'>{comic.title}</h2>
                <p className='single-comic__descr'>{comic.descr}</p>
                <p className='single-comic__descr'>
                    Number of pages: {comic.pageCount}
                </p>
                <p className='single-comic__descr'>
                    Language: {comic.language}
                </p>
                <div className='single-comic__price'>Price: {comic.price}</div>
            </div>
            <Link to='/comics' className='single-comic__back'>
                Back to all
            </Link>
        </div>
    );
};

export default SingleComicPage;
