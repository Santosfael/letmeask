import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from '../contexts/AuthContext';
import { AdminRoom } from './AdminRoom';

import { Home } from './Home';
import { NewRoom } from './NewRoom';
import { Room } from './Rooms';

export function Routes() {

    return (
        <BrowserRouter>
        <AuthContextProvider>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/rooms/new" component={NewRoom} />
                <Route path="/rooms/:id" component={Room} />
                <Route path="/admin/rooms/:id" component={AdminRoom} />
            </Switch>
        </AuthContextProvider>
        </BrowserRouter>
    )
}