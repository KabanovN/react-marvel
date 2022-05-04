import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/marvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

function CharList(props) {
    const [chars, setChars] = useState([]);
    const [newCharLoading, setNewCharLoading] = useState(false); //признак дозагрузки новых персонажей
    const [offset, setOffset] = useState(210); //заданный отступ на сервере для "адекватных" персонажей
    const [charEnded, setCharEnded] = useState(false); //признак окончания перечня персонажей

    const { loading, error, getAllCharacters } = useMarvelService();

    const handleRequestChars = (offset, initial = false) => {
        initial ? setNewCharLoading(false) : setNewCharLoading(true); //только при первичной загрузке, false = спиннер
        getAllCharacters(offset).then(handleCharsLoaded);
    };

    //функция загрузки персонажей
    const handleCharsLoaded = (newChars) => {
        //определение конца списка персонажей
        newChars.length < 9 ? setCharEnded(true) : setCharEnded(false);

        setChars([...chars, ...newChars]); //загрузка текущих из state + новых персонажей
        setOffset((offset) => offset + 9); //увеличение отступа для новых персонажей
        setNewCharLoading(false); //отключаем disabled для кнопки дозагрузки
    };

    const renderCharList = (chars) => {
        const list = chars.map((char) => {
            //применение класса активности на выделенном элементе + возможность выбора через tab
            let itemClass = 'char__item';
            if (char.id === props.charId) {
                itemClass += ' char__item_selected';
            }

            return (
                <li
                    className={itemClass}
                    key={char.id}
                    tabIndex={0}
                    onClick={() => props.onCharSelected(char.id)}>
                    <img
                        src={char.thumbnail}
                        alt='abyss'
                        //применение стиля для not available thumbnails
                        style={{
                            objectFit: char.thumbnail.includes(
                                'image_not_available'
                            )
                                ? 'contain'
                                : 'cover',
                        }}
                    />
                    <div className='char__name'>{char.name}</div>
                </li>
            );
        });

        return <ul className='char__grid'>{list}</ul>;
    };
    const charsList = renderCharList(chars);

    useEffect(() => {
        handleRequestChars(offset, true);
        //eslint-disable-next-line
    }, []);

    const spinner = loading && !newCharLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <div className='char__list'>
            {spinner}
            {errorMessage}
            {charsList}
            <button
                className='button button__main button__long'
                disabled={newCharLoading}
                onClick={() => handleRequestChars(offset)}
                style={{ display: charEnded ? 'none' : 'block' }}>
                <div className='inner'>load more</div>
            </button>
        </div>
    );
}

//проверка на функ-ю и обязательность
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
