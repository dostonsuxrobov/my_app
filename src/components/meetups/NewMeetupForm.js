import Card from '../ui/Card'
import classes from './NewMeetupForm.module.css'

function NewMeetupForm(){

    function submitHandler(){}

    return <Card>
        <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
                <label htmlFor='title'>Meetup Title</label>
                <input type='text' required id="title" />
            </div>

            <div className={classes.control}>
                <label htmlFor='image'>Meetup image</label>
                <input type='url' required id="image" />
            </div>

            <div className={classes.control}>
                <label htmlFor='address'>Meetup address</label>
                <input type='text' required id="address" />
            </div>

            <div className={classes.control}>
                <label htmlFor='description'>Meetup Description</label>
                <textarea id='description' description rows='5'></textarea>
            </div>

            <div className={classes.actions}>
                <button>Add Meetup</button>
            </div>

        </form>
    </Card>
}

export default NewMeetupForm;