import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import rocket from './static/rocket.svg';
import earth from './static/earth.svg';
import moon from './static/moon.svg';
import astronaut from './static/astronaut.svg';
import notFound from './static/404.svg';


export default class NotFound extends Component {
  render () {
    return (
      <React.Fragment>
        <div className="central-body">
          <img className="image-404" src={notFound} width="300px" alt='error'/>
          <Link to="/" className="btn-go-home">GO BACK HOME</Link>
        </div>
        <div className="objects">
            <img className="object_rocket" src={rocket} width="40px" alt='error'/>
            <div className="earth-moon">
                <img className="object_earth" src={earth} width="100px" alt='error'/>
                <img className="object_moon" src={moon} width="80px" alt='error'/>
            </div>
            <div className="box_astronaut">
                <img className="object_astronaut" src={astronaut} width="140px" alt='error'/>
            </div>
        </div>
        <div className="glowing_stars">
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
        </div>
      </React.Fragment>
    );
  }
}
