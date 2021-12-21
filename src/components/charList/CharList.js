import { Component } from 'react/cjs/react.development';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChars();
    }

    onErrorMessage = (error) => {
        this.setState({
            error: true,
            loading: false
        })
    }

    onCharsLoaded = (chars) => {
        this.setState({
            chars,
            loading: false
        });
    }

    updateChars = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharsLoaded)
            .catch(this.onErrorMessage);    
    }

    render() {
        const {chars, loading, error} = this.state;
        const listChars = chars.map(char => {
            let fitStyle = null;
            if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                fitStyle = {'objectFit': 'contain'};
            }

            return (
                <li className="char__item char__item_selected" key={char.id}>
                    <img src={char.thumbnail} alt="abyss" style={fitStyle}/>
                    <div className="char__name">{char.name}</div>
                </li>
            )
        })

        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? listChars : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {spinner}
                    {errorMessage}
                    {content}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }    
}

export default CharList;