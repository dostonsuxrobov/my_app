import { Route, Switch } from 'react-router-dom';


import AllMeetups from './pages/AllMeetups';
import Favourites from './pages/Favourites';
import NewMeetups from './pages/NewMeetups';


function App() {
  return <div>
    <Switch>
      
      < Route path='/' exact >
        <AllMeetups />
      </Route>

      < Route path='/new-meetup'>
        <NewMeetups />
      </Route>

      < Route path='/favorites'>
        <Favourites />
      </Route>

    </Switch>
  </div>;
}

export default App;
