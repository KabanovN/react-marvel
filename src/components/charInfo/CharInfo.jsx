import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCharacter } from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

function CharInfo(props) {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // const marvelService = new MarvelService();

    const updateChar = () => {
        const { charId } = props;
        if (!charId) {
            return;
        }

        onCharLoading(); //для отображения спиннера

        getCharacter(charId).then(onCharLoaded).catch(onErrorMessage);
    };

    const onCharLoading = () => {
        setLoading(true);
    };

    const onCharLoaded = (char) => {
        setLoading(false);
        setChar(char);
    };

    const onErrorMessage = (error) => {
        setError(true);
        setLoading(false);
    };

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId]);

    const skeleton = !loading && !error && !char ? <Skeleton /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !loading && !error && char ? <View char={char} /> : null;

    return (
        <div className='char__info'>
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    );
}

const View = ({ char }) => {
    const { name, thumbnail, description, wiki, homepage, comics } = char;

    //добавление стиля для 'image not available'
    let fitStyle = null;
    if (
        thumbnail ===
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    ) {
        fitStyle = { objectFit: 'contain' };
    }

    //рендеринг списка комиксов
    const comicsList = comics
        .map((item, i) => {
            return (
                <li className='char__comics-item' key={i}>
                    {item.name}
                </li>
            );
        })
        .slice(0, 10);

    return (
        <>
            <div className='char__basics'>
                <img src={thumbnail} alt={name} style={fitStyle} />
                <div>
                    <div className='char__info-name'>{name}</div>
                    <div className='char__btns'>
                        <a href={homepage} className='button button__main'>
                            <div className='inner'>homepage</div>
                        </a>
                        <a href={wiki} className='button button__secondary'>
                            <div className='inner'>Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className='char__descr'>{description}</div>
            <div className='char__comics'>Comics:</div>
            <ul className='char__comics-list'>
                {comics.length > 0 ? null : 'There is no info about comics'}
                {comicsList}
            </ul>
        </>
    );
};

CharInfo.propTypes = {
    charId: PropTypes.number, //проверка на числовой тип пропса charId
};

export default CharInfo;
