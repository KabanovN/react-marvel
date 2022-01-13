import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading(); //для отображения спиннера

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onErrorMessage);
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onErrorMessage = (error) => {
        this.setState({
            error: true,
            loading: false
        })
    }

    render() {
        const {char, loading, error} = this.state;

        const skeleton = (!loading && !error && !char) ? <Skeleton/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !loading && !error && char ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}                
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, thumbnail, description, wiki, homepage, comics} = char;

        //добавление стиля для 'image not available'
        let fitStyle = null;
        if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            fitStyle = {'objectFit': 'contain'}
        }
        
        //рендеринг списка комиксов
        const comicsList = comics.map((item, i) => {
            return (
                <li className="char__comics-item" key={i}>
                    {item.name}
                </li>
            )
        }).slice(0, 10);

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={fitStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no info about comics'}
                {comicsList}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number //проверка на числовой тип пропса charId
}

export default CharInfo;