import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChars();
    }

    updateChars = (offset) => {
        this.onCharLoading();
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

    onCharLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({chars, offset}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    renderCharList = (chars) => {
        const list = chars.map(char => {
            let fitStyle = null;
            if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                fitStyle = {'objectFit': 'contain'};
            }

            return (
                <li className="char__item" 
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

export default CharList;