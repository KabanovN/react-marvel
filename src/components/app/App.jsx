import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';
import MainPage from '../../pages/MainPage';
import ComicsPage from '../../pages/ComicsPage';
import SingleComicPage from '../../pages/SingleComicPage';
import Page404 from '../../pages/Page404';

function App() {
    return (
        <Router basename='/react-marvel'>
            <div className='app'>
                <AppHeader />
                <main>
                    <Routes>
                        <Route path='/' element={<MainPage />} />
                        <Route path='/comics' element={<ComicsPage />} />
                        <Route
                            path='/comics/:comicId'
                            element={<SingleComicPage />}
                        />
                        <Route path='*' element={<Page404 />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
