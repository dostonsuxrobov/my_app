import { Route } from 'react-router-dom';

import AllMeetups from './pages/AllMeetups';
import Favourites from './pages/Favourites';
import NewMeetups from './pages/NewMeetups';


function App() {
  return <div>
      < Route path='/'>
        <AllMeetups />
      </Route>

      <Route path='/new-meetup'>
        <NewMeetups />
      </Route>

      <Route path='/favorites'>
        <Favourites />
      </Route>
    
  </div>;
}

export default App;
