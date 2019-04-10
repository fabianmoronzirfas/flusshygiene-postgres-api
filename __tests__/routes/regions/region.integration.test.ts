jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getCustomRepository } from 'typeorm';
import { RegionRepository } from '../../../src/lib/repositories/RegionRepository';
import routes from '../../../src/lib/routes';
import { DefaultRegions, HttpCodes } from '../../../src/lib/types-interfaces';
import {
  closeTestingConnections,
  createTestingConnections,
  reloadTestingDatabases,
} from '../../test-utils';

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

describe('testing regions api', () => {
  let app: Application;
  let connections: Connection[];

  beforeAll(async (done) => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('We are not in the test env this is harmful tables will be dropped');
    }
    connections = await createTestingConnections();
    done();
  });
  // beforeEach(async (done) => {
  //   try {
  //     await reloadTestingDatabases(connections);
  //     done();
  //   } catch (err) {
  //     console.warn(err.message);
  //     console.warn(err.stack);
  //   }
  // });
  afterAll(async (done) => {
    try {
      await reloadTestingDatabases(connections);
      await closeTestingConnections(connections);
      done();
    } catch (err) {
      console.warn(err.message);
      console.warn(err.stack);
      throw err;
    }
  });

  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1/', routes);

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

// ██████╗  ██████╗ ███╗   ██╗███████╗
// ██╔══██╗██╔═══██╗████╗  ██║██╔════╝
// ██║  ██║██║   ██║██╔██╗ ██║█████╗
// ██║  ██║██║   ██║██║╚██╗██║██╔══╝
// ██████╔╝╚██████╔╝██║ ╚████║███████╗
// ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝

  test('should get all regions', async (done) => {
  const res = await request(app).get(`/api/v1/regions`);
  expect(res.status).toBe(HttpCodes.success);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data[0].id !== undefined).toBe(true);
  expect(res.body.data[0].name !== undefined).toBe(true);
  expect(res.body.data[0].displayName !== undefined).toBe(true);
  done();
});
  test('should post a new region', async (done) => {
  const res = await request(app).post(`/api/v1/regions`).send({
    displayName: 'Bayern',
    name: 'bayern',
  });
  expect(res.status).toBe(HttpCodes.successCreated);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data[0].id !== undefined).toBe(true);
  expect(res.body.data[0].name !== undefined).toBe(true);
  expect(res.body.data[0].displayName !== undefined).toBe(true);
  done();
});
  test('should update a region', async (done) => {
  const regionRepo = getCustomRepository(RegionRepository);
  const region = await regionRepo.findByName(DefaultRegions.niedersachsen);
  const res = await request(app).put(
    `/api/v1/regions/${region.id}`,
    ).send({
      displayName: 'Niedersachsen',
    }).set('Accept', 'application/json');
  const doubeCheckRegion = await request(app).get(`/api/v1/regions/${region.id}`);
  expect(res.status).toBe(HttpCodes.successCreated);
  // console.log(res.body);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data[0].displayName).toEqual('Niedersachsen');
  // console.log(doubeCheckRegion.body);
  expect(doubeCheckRegion.body.data[0].displayName).toEqual('Niedersachsen');
  done();
});
  test('should fail to update due to wrong id', async (done) => {
  const res = await request(app).put(
    `/api/v1/regions/${1000}`,
    ).send({
      displayName: 'Niedersachsen',
    }).set('Accept', 'application/json');
  expect(res.status).toBe(HttpCodes.badRequestNotFound);
    // console.log(res.body);
  expect(res.body.success).toBe(false);
    // console.log(doubeCheckRegion.body);
  done();
});
  test('should fail to delete due to wrong id', async (done) => {
  const res = await request(app).put(
    `/api/v1/regions/${1000}`,
    );
  expect(res.status).toBe(HttpCodes.badRequestNotFound);
    // console.log(res.body);
  expect(res.body.success).toBe(false);
    // console.log(doubeCheckRegion.body);
  done();
});
  test('should delete a region', async (done) => {
  const resCreate = await request(app).post(`/api/v1/regions`).send({
    displayName: 'Fantasia',
    name: 'fantasia',
  });

  const res = await request(app).delete(`/api/v1/regions/${resCreate.body.data[0].id}`);
  // console.log(res.body);
  expect(res.status).toBe(HttpCodes.success);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  // expect(res.body.data[0].id !== undefined).toBe(true);
  // expect(res.body.data[0].name !== undefined).toBe(true);
  // expect(res.body.data[0].displayName !== undefined).toBe(true);
  done();
});
});