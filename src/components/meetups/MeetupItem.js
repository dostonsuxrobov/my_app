import Card from '../ui/Card';
import classes from './MeetupItem.module.css';

import FavoritesContext from '../../store/favorite-context';
import { useContext } from 'react';

function MeetupItem(props){
    const favoriteCtx = useContext(FavoritesContext);

    const itemIs_Favorite = favoriteCtx.itemIsFavorite(props.id);

    function toggleFavoriteStatusHandler() {
        if(itemIs_Favorite){
            favoriteCtx.removeFavorite(props.id);
        } else {
            favoriteCtx.addFavorite({
                id: props.id,
                title: props.title,
                description: props.description,
                image: props.image,
                address: props.address
            })
        }
    }

    return (
    <li className={classes.item}>
        <Card>
            <div className={classes.image}>
                <img src={props.image} alt="" />
            </div>
            <div className={classes.content}>
                <h3>{props.title}</h3>
                <address>{props.address}</address>
                <p>{props.description}</p>
            </div>
            <div className={classes.actions}>
                <button onClick={toggleFavoriteStatusHandler}>
                    {itemIs_Favorite ? 'Remove from Favorites' : 'To Favorites'}
                </button>
            </div>
        </Card>
    </li>
    );
}

export default MeetupItem;