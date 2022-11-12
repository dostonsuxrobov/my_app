import { createContext, useState } from 'react';

const FavoritesContext = createContext({
    favourites: [],
    totalFavorites: 0
});

function FavoritesContextProvider(props){
    const [ userFavorites, setUserFavorites ] = useState([]);

    function addFavoriteHandler(favoriteMeetup){
        setUserFavorites((prevUserFavorites) => {
            return prevUserFavorites.concat(favoriteMeetup);
        });
    }

    function removeFavoriteHandler(meetupId){
        setUserFavorites(prevUserFavorites => {
            return prevUserFavorites.filter(meetup => {
                meetup.id !== meetupId
            }); 
        })
    }

    function itemIsFavoriteHandler(meetupId){
        return userFavorites.some(meetup => meetup.id === meetupId);
    }

    const context = {
        favourites: userFavorites,
        totalFavorites: userFavorites.length
    }

    return <FavoritesContext.Provider>
        {props.children}
    </FavoritesContext.Provider>
}

