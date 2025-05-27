const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const { logger } = require('../../lib/logger');

const expect = chai.expect;

describe('Auth Middleware', function() {
    let req, res, next, sandbox;

    beforeEach(function() {
        sandbox = sinon.createSandbox();
        req = {
            header: sinon.stub(),
            baseUrl: '/api/test'
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
        sandbox.stub(logger, 'info');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should return 401 if no token is provided', function() {
        req.header.withArgs('x-auth-token').returns(undefined);

        auth(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ msg: 'No token, authorization denied' })).to.be.true;
        expect(next.notCalled).to.be.true;
        expect(logger.info.calledOnce).to.be.true;
    });

    it('should call next and set req.user if token is valid', function() {
        const fakeToken = 'valid.token.here';
        const decoded = { user: { id: '123' } };
        req.header.withArgs('x-auth-token').returns(fakeToken);

        sandbox.stub(jwt, 'verify').withArgs(fakeToken, process.env.JWT_SECRET).returns(decoded);

        auth(req, res, next);

        expect(req.user).to.deep.equal(decoded.user);
        expect(next.calledOnce).to.be.true;
        expect(res.status.notCalled).to.be.true;
        expect(logger.info.calledOnce).to.be.true;
    });

    it('should return 401 if token is invalid', function() {
        const fakeToken = 'invalid.token.here';
        req.header.withArgs('x-auth-token').returns(fakeToken);

        sandbox.stub(jwt, 'verify').throws(new Error('invalid token'));

        auth(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ msg: 'Token is not valid' })).to.be.true;
        expect(next.notCalled).to.be.true;
        expect(logger.info.calledOnce).to.be.true;
    });
});