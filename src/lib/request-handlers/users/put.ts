import { getRepository } from 'typeorm';
import { User } from '../../../orm/entity/User';
import { HttpCodes, putResponse } from '../../types-interfaces';
import { errorResponse, responderMissingId, responderSuccessCreated, responderWrongId } from '../responders';

// ██████╗ ██╗   ██╗████████╗
// ██╔══██╗██║   ██║╚══██╔══╝
// ██████╔╝██║   ██║   ██║
// ██╔═══╝ ██║   ██║   ██║
// ██║     ╚██████╔╝   ██║
// ╚═╝      ╚═════╝    ╚═╝

export const updateUser: putResponse = async (request, response) => {
  try {
    if (request.params.userId === undefined) {
      responderMissingId(response);
      // responder(
      //   response,
      //   HttpCodes.badRequest,
      //   errorResponse(new Error('Missing ID paramter'))
      // );
      // throw new Error('Missing id paramater');
    }
    const user: User | undefined = await getRepository(User).findOne(request.params.userId);
    if (user === undefined) {

      responderWrongId(response);

    } else {
      const userRepository = getRepository(User);
      userRepository.merge(user, request.body);
      userRepository.save(user);
      responderSuccessCreated(response, 'updated user');
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};
