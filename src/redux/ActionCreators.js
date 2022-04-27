import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../shared/baseUrl';

export const fetchCampsites = () => dispatch => {
  dispatch(campsitesLoading());
  return fetch(baseUrl + 'campsites')
    .then(
      response => {
        if (response.ok) {
          //good response
          return response;
        } else {
          //bad response
          const error = new Error(`Error ${response.status}: ${response.statusText}`);
          error.response = response;
          throw error;
        }
      },
      error => {
        //no response
        const errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then(response => response.json())
    .then(campsites => dispatch(addCampsites(campsites)))
    .catch(error => dispatch(campsitesFailed(error.message)));
  // setTimeout(() => {
  //     setTimeout(()=>{
  //         dispatch(addCampsites(CAMPSITES));
  //     });
  // }, 2000);
};

export const campsitesLoading = () => ({
  type: ActionTypes.CAMPSITES_LOADING,
});

export const campsitesFailed = errMess => ({
  type: ActionTypes.CAMPSITES_FAILED,
  payload: errMess,
});

export const addCampsites = campsites => ({
  type: ActionTypes.ADD_CAMPSITES,
  payload: campsites,
});

export const fetchComments = () => dispatch => {
  return fetch(baseUrl + 'comments')
    .then(
      response => {
        if (response.ok) {
          //good response
          return response;
        } else {
          //bad response
          const error = new Error(`Error ${response.status}: ${response.statusText}`);
          error.response = response;
          throw error;
        }
      },
      error => {
        //no response
        const errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then(response => response.json())
    .then(comments => dispatch(addComments(comments)))
    .catch(error => dispatch(commentsFailed(error.message)));
};

export const commentsFailed = errMess => ({
  type: ActionTypes.COMMENTS_FAILED,
  payload: errMess,
});

export const addComments = comments => ({
  type: ActionTypes.ADD_COMMENTS,
  payload: comments,
});

export const addComment = comment => ({
  type: ActionTypes.ADD_COMMENT,
  payload: comment,
});

export const postComment = (campsiteId, rating, author, text) => dispatch => {
  
  const newComment = {
    campsiteId: campsiteId,
    rating: rating,
    author, // shorthand version. same as author: author
    text, // shorthand version
  };
  
  newComment.date = new Date().toISOString();
  return fetch(baseUrl + 'comments', {
    method: 'POST',
    body: JSON.stringify(newComment),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
      response => {
        if (response.ok) {
          //good response
          return response;
        } else {
          //bad response
          const error = new Error(`Error ${response.status}: ${response.statusText}`);
          error.response = response;
          throw error;
        }
      },
      error => {//no response;
        throw error
      })
      .then(response => response.json())
      .then(response => dispatch(addComment(response)))
      .catch(error => {
        console.log("post comment: ", error.message);
        alert("Your comment could not be posted\nError: "+error.message);
      })
};

export const fetchPromotions = () => dispatch => {
  dispatch(promotionLoading());
  return fetch(baseUrl + 'promotions')
    .then(
      response => {
        if (response.ok) {
          //good response
          return response;
        } else {
          //bad response
          const error = new Error(`Error ${response.status}: ${response.statusText}`);
          error.response = response;
          throw error;
        }
      },
      error => {
        //no response
        const errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then(response => response.json())
    .then(promotions => dispatch(addPromotions(promotions)))
    .catch(error => dispatch(promotionsFailed(error.message)));
};

export function promotionLoading() {
  return {
    type: ActionTypes.PROMOTIONS_LOADING,
  };
}

export function promotionsFailed(errMess) {
  return {
    type: ActionTypes.PROMOTIONS_FAILED,
    payload: errMess,
  };
}

export function addPromotions(promotions) {
  return {
    type: ActionTypes.ADD_PROMOTIONS,
    payload: promotions,
  };
}
