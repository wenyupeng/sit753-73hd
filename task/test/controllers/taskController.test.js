const sinon = require('sinon');
const { expect } = require('chai');
const taskController = require('../../controllers/taskController');
const Task = require('../../models/Task');

describe('taskController', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            user: { id: 'user123' },
            params: { id: 'task123' },
            body: {}
        };
        res = {
            json: sandbox.stub(),
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getTasks', () => {
        it('should return tasks for the user', async () => {
            const tasks = [{ title: 'Test', user: 'user123' }];
            sandbox.stub(Task, 'find').returns({ sort: sandbox.stub().resolves(tasks) });

            await taskController.getTasks(req, res);

            expect(res.json.calledWith(tasks)).to.be.true;
        });

        it('should handle errors', async () => {
            sandbox.stub(Task, 'find').throws(new Error('DB error'));

            await taskController.getTasks(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Server Error')).to.be.true;
        });
    });

    describe('getTask', () => {
        it('should return a task if found and authorized', async () => {
            const task = { user: 'user123', toString: () => 'user123' };
            sandbox.stub(Task, 'findById').resolves(task);

            await taskController.getTask(req, res);

            expect(res.json.calledWith(task)).to.be.true;
        });

        it('should return 404 if task not found', async () => {
            sandbox.stub(Task, 'findById').resolves(null);

            await taskController.getTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: 'Task not found' })).to.be.true;
        });

        it('should return 401 if not authorized', async () => {
            const task = { user: 'otherUser', toString: () => 'otherUser' };
            sandbox.stub(Task, 'findById').resolves(task);

            await taskController.getTask(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ msg: 'Not authorized' })).to.be.true;
        });

        it('should handle ObjectId error', async () => {
            const error = new Error('CastError');
            error.kind = 'ObjectId';
            sandbox.stub(Task, 'findById').throws(error);

            await taskController.getTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: 'Task not found' })).to.be.true;
        });

        it('should handle other errors', async () => {
            sandbox.stub(Task, 'findById').throws(new Error('DB error'));

            await taskController.getTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Server Error')).to.be.true;
        });
    });

    describe('createTask', () => {
        it('should create and return a new task', async () => {
            req.body = { title: 'New', description: 'desc', completed: false };
            const savedTask = { ...req.body, user: 'user123' };
            sandbox.stub(Task.prototype, 'save').resolves(savedTask);

            await taskController.createTask(req, res);

            expect(res.json.calledWith(savedTask)).to.be.true;
        });

        it('should handle errors', async () => {
            sandbox.stub(Task.prototype, 'save').throws(new Error('DB error'));

            await taskController.createTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Server Error')).to.be.true;
        });
    });

    describe('updateTask', () => {
        it('should update and return the task', async () => {
            req.body = { title: 'Updated', completed: true };
            const task = { user: 'user123', toString: () => 'user123' };
            const updatedTask = { ...task, ...req.body };
            sandbox.stub(Task, 'findById').resolves(task);
            sandbox.stub(Task, 'findByIdAndUpdate').resolves(updatedTask);

            await taskController.updateTask(req, res);

            expect(res.json.calledWith(updatedTask)).to.be.true;
        });

        it('should return 404 if task not found', async () => {
            sandbox.stub(Task, 'findById').resolves(null);

            await taskController.updateTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: 'Task not found' })).to.be.true;
        });

        it('should return 401 if not authorized', async () => {
            const task = { user: 'otherUser', toString: () => 'otherUser' };
            sandbox.stub(Task, 'findById').resolves(task);

            await taskController.updateTask(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ msg: 'Not authorized' })).to.be.true;
        });

        it('should handle ObjectId error', async () => {
            const error = new Error('CastError');
            error.kind = 'ObjectId';
            sandbox.stub(Task, 'findById').throws(error);

            await taskController.updateTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: 'Task not found' })).to.be.true;
        });

        it('should handle other errors', async () => {
            sandbox.stub(Task, 'findById').throws(new Error('DB error'));

            await taskController.updateTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Server Error')).to.be.true;
        });
    });

    describe('deleteTask', () => {
        it('should delete the task and return success message', async () => {
            const task = { user: 'user123', toString: () => 'user123' };
            sandbox.stub(Task, 'findById').resolves(task);
            sandbox.stub(Task, 'findByIdAndDelete').resolves();

            await taskController.deleteTask(req, res);

            expect(res.json.calledWith({ msg: 'Task removed' })).to.be.true;
        });

        it('should return 404 if task not found', async () => {
            sandbox.stub(Task, 'findById').resolves(null);

            await taskController.deleteTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: 'Task not found' })).to.be.true;
        });

        it('should return 401 if not authorized', async () => {
            const task = { user: 'otherUser', toString: () => 'otherUser' };
            sandbox.stub(Task, 'findById').resolves(task);

            await taskController.deleteTask(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ msg: 'Not authorized' })).to.be.true;
        });

        it('should handle ObjectId error', async () => {
            const error = new Error('CastError');
            error.kind = 'ObjectId';
            sandbox.stub(Task, 'findById').throws(error);

            await taskController.deleteTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: 'Task not found' })).to.be.true;
        });

        it('should handle other errors', async () => {
            sandbox.stub(Task, 'findById').throws(new Error('DB error'));

            await taskController.deleteTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Server Error')).to.be.true;
        });
    });
});