import { BrowserRouter, Route } from 'react-router-dom';
import { AuthContextProvider } from '../contexts/AuthContext';

import { Home } from './Home';
import { NewRoom } from './NewRoom';

export function Routes() {

    return (
        <BrowserRouter>
        <AuthContextProvider>
            <Route path="/" exact component={Home} />
            <Route path="/rooms/new" component={NewRoom} />
        </AuthContextProvider>
        </BrowserRouter>
    )
}