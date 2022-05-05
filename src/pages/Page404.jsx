import { Link } from 'react-router-dom';
import ErrorMessage from '../components/errorMessage/ErrorMessage';

function Page404() {
    return (
        <>
            <ErrorMessage />
            <p
                style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    textAlign: 'center',
                }}>
                Page doesn't exist
            </p>
            <Link
                to='/'
                style={{
                    display: 'block',
                    marginTop: '30px',
                    fontSize: '24px',
                    fontWeight: '700',
                    textAlign: 'center',
                    textDecoration: 'underline',
                    color: '#9f0013',
                    cursor: 'pointer',
                }}>
                Back to Main Page
            </Link>
        </>
    );
}

export default Page404;
