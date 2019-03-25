import { getCustomRepository, getRepository } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { RegionRepository } from '../../repositories/RegionRepository';
import { getResponse, HttpCodes, Regions } from '../../types-interfaces';
import { errorResponse, responder, responderWrongId } from '../responders';
import { BathingspotRepository } from './../../repositories/BathingspotRepository';

/**
 * Todo: Which properties should be returned
 */
export const getBathingspots: getResponse = async (_request, response) => {
  let spots: Bathingspot[];
  try {
    spots = await getRepository(Bathingspot).find(
      {
        select: ['name'],
        where: { isPublic: true },
      },
    );
    responder(response, HttpCodes.success, spots);
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
export const getSingleBathingspot: getResponse = async (request, response) => {
  let spot: Bathingspot | undefined;
  if (request.params.id === undefined) {
    throw new Error('id is not defined');
  }
  try {
    spot = await getRepository(Bathingspot).findOne(request.params.id);
    if (spot === undefined) {
      responderWrongId(response);
    } else {
      responder(response, HttpCodes.success, [spot]);
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};

export const getBathingspotsByRegion: getResponse = async (request, response) => {
  try {
    if (!(request.params.region in Regions)) {
      responderWrongId(response);
    } else {
      const regionRepo = getCustomRepository(RegionRepository);
      const spotRepo = getCustomRepository(BathingspotRepository);
      const region = await regionRepo.findByName(request.params.region);
      let spots: []|any = [];
      if (region !== undefined) {
        spots = await spotRepo.findByRegionId(region.id);
        if (spots === undefined) {
          spots = [];
        } else {
          spots = spots.filter((spot: Bathingspot) => spot.isPublic === true );
        }
        responder(response, HttpCodes.success, spots);
      } else {
        responderWrongId(response);
      }
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
