import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false, //дозагрузка новых персонажей
        offset: 210, //заданный отступ на сервере для "адекватных" персонажей
        charEnded: false, //признак окончания перечня персонажей
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChars(); //отступ по умолчению
    }

    updateChars = (offset) => {
        this.onCharLoading(); //при первоначальном рендеринге не повлияет
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onErrorMessage);    
    }

    onErrorMessage = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    //метод для вкл disabled на кнопке дозагрузки
    onCharLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    //функция загрузки персонажей
    onCharsLoaded = (newChars) => {
        //определение конца списка персонажей (загрузка по 9)
        let ended = false;
        if (newChars.length < 9) {
            ended = true; //данное значение отражаем в state (стр.60)
        }

        this.setState(({chars, offset}) => ({
            chars: [...chars, ...newChars], //загрузка текущих из state + новых персонажей
            loading: false, //отключаем рендеринг спиннера
            newItemLoading: false, //отключаем disabled для кнопки дозагрузки
            offset: offset + 9, //увеличение отступа на новых персонажей
            charEnded: ended //стр.48-52
        }));
    }

    renderCharList = (chars) => {
        //применение стиля для not available thumbnails
        const list = chars.map(char => {
            let fitStyle = null;
            if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                fitStyle = {'objectFit': 'contain'};
            }

            let itemClass = 'char__item';
            let tabindex;
            if (char.id === this.props.charId) {
                itemClass += ' char__item_selected';
                tabindex = 0;
            }

            return (
                <li className={itemClass} 
                    key={char.id}
                    tabindex={tabindex}   
                    onClick={() => this.props.onCharSelected(char.id)}>
                        <img src={char.thumbnail} alt="abyss" style={fitStyle}/>
                        <div className="char__name">{char.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {list}
            </ul>
        )
    }

    render() {
        const {chars, loading, error, newItemLoading, offset, charEnded} = this.state;
        const charsList = this.renderCharList(chars);

        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? charsList : null;

        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.updateChars(offset)}
                    style={{'display': charEnded ? 'none' : 'block'}}>
                        <div className="inner">load more</div>
                </button>
            </div>
        )
    }    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired //проверка на функ-ю и обязательность
}

export default CharList;