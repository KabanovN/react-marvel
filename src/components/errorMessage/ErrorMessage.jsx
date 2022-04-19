import img from './error.gif';
import './error.scss';

const ErrorMessage = () => {
    return <img src={img} alt='error' className='errorImg' />;
};

export default ErrorMessage;
