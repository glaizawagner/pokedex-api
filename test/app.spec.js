const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200', () => {
    return supertest(app)
      .get('/')
      .set({'Authorization': '1c2f4eac-fa79-11e9-8f0b-362b9e155667'})
      .expect(200);
  });
});