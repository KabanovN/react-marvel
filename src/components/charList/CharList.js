import { Component } from 'react';
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

    renderCharList = (chars) => {
        const list = chars.map(char => {
            let fitStyle = null;
            if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                fitStyle = {'objectFit': 'contain'};
            }

            return (
                <li className="char__item char__item_selected" 
                    key={char.id}   
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
        const {chars, loading, error} = this.state;
        const charsList = this.renderCharList(chars);

        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? charsList : null;

        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }    
}

export default CharList;