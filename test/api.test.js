const request = require('supertest');
const { expect } = require('chai');
const express = require('express');
const app = 'http://localhost:3000'; // We'll just target the running server

let testToken = '';
const testUsername = 'testuser_' + Date.now();
const testPassword = 'password123';

describe('World Wall API Integration Tests', () => {
  it('should register a new user', (done) => {
    request(app)
      .post('/api/register')
      .send({ username: testUsername, password: testPassword })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('username', testUsername);
        done();
      });
  });

  it('should not register a duplicate user', (done) => {
    request(app)
      .post('/api/register')
      .send({ username: testUsername, password: testPassword })
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error', 'Username already exists');
        done();
      });
  });

  it('should login the user and return a JWT', (done) => {
    request(app)
      .post('/api/login')
      .send({ username: testUsername, password: testPassword })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('token');
        testToken = res.body.token;
        done();
      });
  });

  it('should post an artwork when authenticated', (done) => {
    request(app)
      .post('/api/artworks')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ image_data: 'data:image/png;base64,testdata' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should not post an artwork when unauthenticated', (done) => {
    request(app)
      .post('/api/artworks')
      .send({ image_data: 'data:image/png;base64,testdata2' })
      .expect(401, done);
  });

  it('should get all artworks including the newly created one', (done) => {
    request(app)
      .get('/api/artworks')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        const lastArtwork = res.body[res.body.length - 1];
        expect(lastArtwork).to.have.property('username', testUsername);
        expect(lastArtwork).to.have.property('image_data', 'data:image/png;base64,testdata');
        done();
      });
  });
});
