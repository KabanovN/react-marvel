import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllCharacters } from '../../services/marvelService';
import './charList.scss';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

function CharList(props) {
    const [chars, setChars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false); //дозагрузка новых персонажей
    const [offset, setOffset] = useState(210); //заданный отступ на сервере для "адекватных" персонажей
    const [charEnded, setCharEnded] = useState(false); //признак окончания перечня персонажей

    const updateChars = (offset) => {
        onCharLoading(); //при первоначальном рендеринге не повлияет
        getAllCharacters(offset).then(onCharsLoaded).catch(onErrorMessage);
    };

    const onErrorMessage = () => {
        setError(true);
        setLoading(false);
    };

    //метод для вкл disabled на кнопке дозагрузки
    const onCharLoading = () => {
        setNewItemLoading(true);
    };

    //функция загрузки персонажей
    const onCharsLoaded = (newChars) => {
        //определение конца списка персонажей (загрузка по 9)
        let ended = false;
        if (newChars.length < 9) {
            ended = true; //данное значение отражаем в state
        }

        setChars((chars) => [...chars, ...newChars]); //загрузка текущих из state + новых персонажей
        setLoading(false); //отключаем рендеринг спиннера
        setNewItemLoading(false); //отключаем disabled для кнопки дозагрузки
        setOffset((offset) => offset + 9); //увеличение отступа на новых персонажей
        setCharEnded(ended);
    };

    const renderCharList = (chars) => {
        //применение стиля для not available thumbnails
        const list = chars.map((char) => {
            let fitStyle = null;
            if (
                char.thumbnail ===
                'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
            ) {
                fitStyle = { objectFit: 'contain' };
            }

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
                    tabindex={tabindex}
                    onClick={() => props.onCharSelected(char.id)}>
                    <img src={char.thumbnail} alt='abyss' style={fitStyle} />
                    <div className='char__name'>{char.name}</div>
                </li>
            );
        });

        return <ul className='char__grid'>{list}</ul>;
    };

    useEffect(() => {
        updateChars();
        // eslint-disable-next-line
    }, []);

    const charsList = renderCharList(chars);

    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || error) ? charsList : null;

    return (
        <div className='char__list'>
            {spinner}
            {errorMessage}
            {content}
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
