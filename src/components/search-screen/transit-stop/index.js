import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import PredictionListItem from "../prediction-list-item";
import {getPredicationByStopIdOneDirection, getPredicationByStopIdZeroDirection} from "../../../actions/prediction-action";
import {findRapidTransitRouteDestinationDirections} from "../../../actions/search-action";
import {useDispatch, useSelector} from "react-redux";
import {findAlertsByStop} from "../../../actions/alerts-action";
import {pinStop} from "../../../services/pinned-stop-service";
import * as service from "../../../services/authentication-service";
import {pinnedStopAlreadyExists} from "../../../actions/pinned-stops-action";

const TransitStop = () => {
    const isLoggedIn = useSelector(state=> state.sessionReducer.isLoggedIn)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const [zeroDirectionPredictions, setZeroDirectionPredictions] = useState([]);
    const [oneDirectionPredictions, setOneDirectionPredictions] = useState([]);
    const [destinationDirections, setDestinationDirections] = useState([]);

    const transitType = params.transitType;
    const stopId = params.stopId;
    const routeId = params.routeId;
    //const location = useLocation().pathname.split("/");
    //const newLocation = location.filter(element => element != "");
    const routeName = params.routeName;
    const stopName = params.stopName;
    const stopNameForTransitStop = stopName.replace(/_/g," ").replace("*","/");
    const route = routeName.replace(/_/g," ");
    const name = stopName.replace(/_/g," ");

    const pinExists = useSelector(state => state.pinExists);
    useEffect(()=> pinnedStopAlreadyExists(dispatch, transitType,routeId, stopId, "me"),
        []);


    useEffect(() => {
        getPredicationByStopIdZeroDirection(stopId).then(response => setZeroDirectionPredictions(response));
        getPredicationByStopIdOneDirection(stopId).then(response => setOneDirectionPredictions(response));
        findRapidTransitRouteDestinationDirections(routeId).then(response => setDestinationDirections(response));
    }, [])

    let backgroundColor;
    if(transitType === 'rapid-transit') {
        backgroundColor = 'rt-route-color';
    } else if (transitType === 'bus') {
        backgroundColor = 'bus-route-color';
    } else if (transitType === 'commuter-rail') {
        backgroundColor = 'cr-color';
    } else if (transitType === 'ferry') {
        backgroundColor = 'ferry-route-color';
    }

    const goToLogin = () => {
        alert("Please log in to pin a stop!");
        navigate('/login');
    }

    const blockPin = () => {
        alert("You have already pinned this route stop.");
        return;
    }

    const reloadAfterPin = () => {
        window.location.reload();
        return false;
    }

    return(


        <div>
            <ul className='list-group'>
                <li className="list-group-item ">
                     <div className=' container'>
                                     <span className=' row text-center'>
                          <div className='col-4'>
                               <span className="col-12 btn back-button-transit-stop"
                                                   onClick={() => navigate(-1)}>
                                                 Back
                                             </span>
                                         </div>
                                         <div className='col-4'>
                                             <span className="col-12 btn bg-danger "
                                                   onClick={() => findAlertsByStop(dispatch, stopId, name)}>
                                                 Alerts
                                             </span>
                                         </div>
                                         {isLoggedIn ?
                                             <>
                                             {pinExists === 0 ?
                                                     <div className='col-4'>
                                             <span onClick={() => pinStop(transitType, "me", routeId, route, stopId, name).then()} className="col-12 btn btn-warning">
                                                 Pin Stop
                                             </span>
                                                     </div>

                                             :
                                                     <div className='col-4'>
                                             <span onClick={blockPin} className="col-12 btn btn-warning">
                                                 Pin Stop
                                             </span>
                                                     </div>

                                             }
                                             </>

                                             :
                                             <div className='col-4'>
                                             <span onClick={goToLogin} className="col-12 btn btn-warning">
                                                 Pin Stop
                                             </span>
                                             </div>
                                         }
                                     </span>
                     </div>
                </li>
                <li className="transit-stop-no-list">

            <div className={`list-group-item ${backgroundColor}`}>
                <div className='col-12' >
                    <div className='row mt-1'>
                        <span className="fw-bold text-light h3 col justify-content-center d-flex">
                            {stopNameForTransitStop}
                        </span>
                    </div>
                    <div className='row mx-0 justify-content-center'>
                        <div className='row mx-0 my-1'>
                            <div className='list-group m-0 px-0'>
                                <li className='list-group-item fw-bold text-primary'>To {destinationDirections[0]}</li>
                                {zeroDirectionPredictions.map(prediction => {return(
                                        <PredictionListItem prediction={prediction.attributes}/>)
                                    }
                                )}
                            </div>
                        </div>
                        <div className='row mx-0 my-1'>
                            <div className='list-group m-0 px-0'>
                                <li className='list-group-item fw-bold text-primary'>To {destinationDirections[1]}</li>
                                {oneDirectionPredictions.map(prediction => {return(
                                        <PredictionListItem prediction={prediction.attributes}/>)
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                </li>
            </ul>
        </div>
    )
};

export default TransitStop;