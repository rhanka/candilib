import test from 'ava';
import request from 'supertest';
import app from '../../server';
import Candidat from '../candidat';
import { connectDB, dropDB } from '../../util/test-helpers';

test.before('connect to mockgoose', async () => {
  await connectDB();
});

test.afterEach.always(async () => {
  await dropDB();
});

test.serial('Should send correct candidat when queried against a neph', async t => {
  t.plan(2);

  const candidat = new Candidat({
    nomNaissance: 'toto',
    nomUsage: 'tata',
    prenom: 'titi',
    codeNeph: '180894100002',
    dateNaissance: '1982-08-11',
    dateReussiteETG: '2014-03-13T00:00:00.000Z',
    dateDernierEchecPratique: '2018-03-13T00:00:00.000Z',
    reussitePratique: 'NOK',
    adresse: '2 rue docteur ramon 94000 creteil',
    mobile: '0600000000',
    email: 'sl@gmail.com',
  });
  candidat.save();

  const res = await request(app)
    .get('/api/candidats/neph/180894100002')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.is(res.body.name, candidat.name);
});

test.serial('Should correctly add a candidat', async t => {
  t.plan(1);

  const res = await request(app)
    .post('/api/signup')
    .send({
      nomNaissance: 'toto',
      nomUsage: 'tata',
      prenom: 'titi',
      codeNeph: 180894100003,
      dateNaissance: '1982-08-11',
      dateReussiteETG: '2014-03-13T00:00:00.000Z',
      dateDernierEchecPratique: '2018-03-13T00:00:00.000Z',
      reussitePratique: 'NOK',
      adresse: '2 rue docteur ramon 94000 creteil',
      portable: '0600000000',
      email: 'sl@gmail.com',
    })
    .set('Accept', 'application/json');

  t.is(res.status, 200);
});

test.serial('Should correctly delete a candidat', async t => {
  t.plan(2);

  const candidat = new Candidat({
    nomNaissance: 'toto',
    nomUsage: 'tata',
    prenom: 'titi',
    codeNeph: '180894100004',
    dateNaissance: '1982-08-11',
    dateReussiteETG: '2014-03-13T00:00:00.000Z',
    dateDernierEchecPratique: '2018-03-13T00:00:00.000Z',
    reussitePratique: 'NOK',
    adresse: '2 rue docteur ramon 94000 creteil',
    portable: '0600000000',
    email: 'sl@gmail.com',
  });
  candidat.save();

  const res = await request(app)
    .delete(`/api/candidats/neph/${candidat.codeNeph}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const queriedCandidat = await Candidat.findOne({ codeNeph: candidat.neph })
    .exec();
  t.is(queriedCandidat, null);
});
