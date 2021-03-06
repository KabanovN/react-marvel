import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/marvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

function CharInfo(props) {
    const [char, setChar] = useState(null);

    const { loading, error, getCharacter, clearError } = useMarvelService();

    const updateChar = () => {
        const { charId } = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacter(charId).then((char) => setChar(char));
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
                <img
                    src={thumbnail}
                    alt={name}
                    style={{
                        objectFit:
                            thumbnail.indexOf('image_not_available') !== -1
                                ? 'contain'
                                : 'cover',
                    }}
                />
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
    charId: PropTypes.number, //???????????????? ???? ???????????????? ?????? ???????????? charId
};

export default CharInfo;
