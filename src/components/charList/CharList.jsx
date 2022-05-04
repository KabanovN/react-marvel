import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/marvelService';
import './charList.scss';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

function CharList(props) {
    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false); //дозагрузка новых персонажей
    const [offset, setOffset] = useState(210); //заданный отступ на сервере для "адекватных" персонажей
    const [charEnded, setCharEnded] = useState(false); //признак окончания перечня персонажей

    const { loading, error, getAllCharacters } = useMarvelService();

    const updateChars = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true); //только при первичной загрузке false = спиннер
        getAllCharacters(offset).then(onCharsLoaded);
    };

    //функция загрузки персонажей
    const onCharsLoaded = (newChars) => {
        //определение конца списка персонажей (загрузка по 9)
        let ended = false;
        if (newChars.length < 9) {
            ended = true; //данное значение отражаем в state
        }

        setChars((chars) => [...chars, ...newChars]); //загрузка текущих из state + новых персонажей
        setNewItemLoading(false); //отключаем disabled для кнопки дозагрузки
        setOffset((offset) => offset + 9); //увеличение отступа на новых персонажей
        setCharEnded(ended);
    };

    const renderCharList = (chars) => {
        //применение стиля для not available thumbnails
        const list = chars.map((char) => {
            let fitStyle;
            char.thumbnail.includes('image_not_available')
                ? (fitStyle = { objectFit: 'contain' })
                : (fitStyle = { objectFit: 'cover' });

            //применение класса активности на выделенном элементе + возможность выбора через tab
            let itemClass = 'char__item';
            let tabindex;
            if (char.id === props.charId) {
                itemClass += ' char__item_selected';
                tabindex = 0;
            }

            return (
                <li
                    className={itemClass}
                    key={char.id}
                    tabIndex={tabindex}
                    onClick={() => props.onCharSelected(char.id)}>
                    <img src={char.thumbnail} alt='abyss' style={fitStyle} />
                    <div className='char__name'>{char.name}</div>
                </li>
            );
        });

        return <ul className='char__grid'>{list}</ul>;
    };
    const charsList = renderCharList(chars);

    useEffect(() => {
        updateChars(offset, true);

        //eslint-disable-next-line
    }, []);

    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <div className='char__list'>
            {spinner}
            {errorMessage}
            {charsList}
            <button
                className='button button__main button__long'
                disabled={newItemLoading}
                onClick={() => updateChars(offset)}
                style={{ display: charEnded ? 'none' : 'block' }}>
                <div className='inner'>load more</div>
            </button>
        </div>
    );
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired, //проверка на функ-ю и обязательность
};

export default CharList;
