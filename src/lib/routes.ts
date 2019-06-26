import { postPrediction } from './request-handlers/users/bathingspots/prediction/post';
import jwtAuthz from 'express-jwt-authz';
import Router from 'express-promise-router';
import { checkJwt } from './auth';
import {
  getBathingspots,
  getSingleBathingspot,
} from './request-handlers/bathingspots';
import { getBathingspotsByRegion } from './request-handlers/bathingspots/get';
import { deleteRegion, getAllRegions, postRegion, putRegion } from './request-handlers/regions';
import { getRegionById } from './request-handlers/regions/index';
// import { defaultGetResponse, defaultPostResponse } from './request-handlers/default-requests';
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from './request-handlers/users/';
import {
  addBathingspotToUser,
  deleteBathingspotOfUser,
  getOneUserBathingspotById,
  getUserBathingspots,
  updateBathingspotOfUser,
} from './request-handlers/users/bathingspots/';
import { getOneUsersBathingspotsByRegion } from './request-handlers/users/bathingspots/get';
import { getResponse } from './types-interfaces';
import { getPredictions } from './request-handlers/users/bathingspots/prediction/get';

const checkScopes = jwtAuthz(['admin', 'read:bathingspots']);

const router = Router();

// endpoint for testing if API is live and tokens work
const getPing : getResponse = async (request, response) =>{
  response.status(200).json(request);
}
router.get('/ping',checkJwt, checkScopes, getPing);

router.get('/users', checkJwt, checkScopes, getUsers);
// get user by id
router.get('/users/:userId([0-9]+)', checkJwt, checkScopes, getUser);

router.get('/users/:userId([0-9]+)/bathingspots', checkJwt, checkScopes, getUserBathingspots);

router.get('/users/:userId([0-9]+)/bathingspots/:region([a-z]+)',
  checkJwt,
  checkScopes,
  getOneUsersBathingspotsByRegion);

router.get('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)',  checkJwt, checkScopes, getOneUserBathingspotById);

// add new spot to user

router.post('/users/:userId([0-9]+)/bathingspots',  checkJwt, checkScopes, addBathingspotToUser);

router.put('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)',  checkJwt, checkScopes, updateBathingspotOfUser);

router.delete('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)',  checkJwt, checkScopes, deleteBathingspotOfUser);

// POST and GET predictions to spot

router.post('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/predictions', checkJwt, checkScopes, postPrediction);
router.get('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/predictions', checkJwt, checkScopes, getPredictions);
// add new user

router.post('/users', checkJwt, checkScopes, addUser);
// update user
router.put('/users/:userId([0-9]+)', checkJwt, checkScopes, updateUser);
// delete user
router.delete('/users/:userId([0-9]+)', checkJwt, checkScopes, deleteUser);

// get all bathingspots PUBLIC
router.get('/bathingspots', getBathingspots);

router.get('/bathingspots/:id([0-9]+)', getSingleBathingspot);

router.get('/bathingspots/:region([a-z]+)', getBathingspotsByRegion);

router.get('/regions', getAllRegions);
router.get('/regions/:regionId([0-9]+)', getRegionById);

router.post('/regions', checkJwt, checkScopes, postRegion);
router.put('/regions/:regionId([0-9]+)',  checkJwt, checkScopes, putRegion);
router.delete('/regions/:regionId([0-9]+)',  checkJwt, checkScopes, deleteRegion);

export default router;
