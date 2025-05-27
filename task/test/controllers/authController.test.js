const assert = require('assert');
const sinon = require('sinon');
const authController = require('../../controllers/authController');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('authController', function () {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = { body: {}, user: {} };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
            send: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('register', function () {
        it('should return 400 if user already exists', async function () {
            req.body = { name: 'Test', email: 'test@example.com', password: 'pass' };
            sandbox.stub(User, 'findOne').resolves({ id: '123' });

            await authController.register(req, res);

            assert(res.status.calledWith(400));
            assert(res.json.calledWith({ msg: 'User already exists' }));
        });

        it('should save user and return token', async function () {
            req.body = { name: 'Test', email: 'test@example.com', password: 'pass' };
            sandbox.stub(User, 'findOne').resolves(null);
            const saveStub = sandbox.stub().resolves();
            sandbox.stub(User.prototype, 'save').callsFake(saveStub);
            sandbox.stub(jwt, 'sign').callsFake((payload, secret, opts, cb) => cb(null, 'token123'));

            await authController.register(req, res);

            assert(res.json.calledWith({ token: 'token123' }));
        });

        it('should handle server error', async function () {
            req.body = { name: 'Test', email: 'test@example.com', password: 'pass' };
            sandbox.stub(User, 'findOne').throws(new Error('DB error'));

            await authController.register(req, res);

            assert(res.status.calledWith(500));
            assert(res.send.calledWith('Server error'));
        });
    });

    describe('login', function () {
        it('should return 400 if user not found', async function () {
            req.body = { email: 'test@example.com', password: 'pass' };
            sandbox.stub(User, 'findOne').resolves(null);

            await authController.login(req, res);

            assert(res.status.calledWith(400));
            assert(res.json.calledWith({ msg: 'Invalid Credentials' }));
        });

        it('should return 400 if password does not match', async function () {
            req.body = { email: 'test@example.com', password: 'pass' };
            const user = { matchPassword: sandbox.stub().resolves(false) };
            sandbox.stub(User, 'findOne').resolves(user);

            await authController.login(req, res);

            assert(res.status.calledWith(400));
            assert(res.json.calledWith({ msg: 'Invalid Credentials' }));
        });

        it('should return token if credentials are valid', async function () {
            req.body = { email: 'test@example.com', password: 'pass' };
            const user = { id: '123', matchPassword: sandbox.stub().resolves(true) };
            sandbox.stub(User, 'findOne').resolves(user);
            sandbox.stub(jwt, 'sign').callsFake((payload, secret, opts, cb) => cb(null, 'token456'));

            await authController.login(req, res);

            assert(res.json.calledWith({ token: 'token456' }));
        });

        it('should handle server error', async function () {
            req.body = { email: 'test@example.com', password: 'pass' };
            sandbox.stub(User, 'findOne').throws(new Error('DB error'));

            await authController.login(req, res);

            assert(res.status.calledWith(500));
            assert(res.send.calledWith('Server error'));
        });
    });

    describe('getMe', function () {
        it('should return user data without password', async function () {
            req.user = { id: '123' };
            const userData = { id: '123', name: 'Test', email: 'test@example.com' };
            sandbox.stub(User, 'findById').returns({ select: sandbox.stub().resolves(userData) });

            await authController.getMe(req, res);

            assert(res.json.calledWith(userData));
        });

        it('should handle server error', async function () {
            req.user = { id: '123' };
            sandbox.stub(User, 'findById').throws(new Error('DB error'));

            await authController.getMe(req, res);

            assert(res.status.calledWith(500));
            assert(res.send.calledWith('Server error'));
        });
    });
});