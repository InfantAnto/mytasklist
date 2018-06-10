var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://anto:anto55@ds153980.mlab.com:53980/mytasklist_anto', ['tasks'])

router.get('/tasks', function(req, res, next) {
    db.tasks.find(function(err, tasks) {
        if (err) {
            console.log(err);
        }

        res.json(tasks);
    });
});

router.get('/task/:id', function(req, res, next) {
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task) {
        checkErrOrRenderJSON(err, task);
    });
});

// Save task
router.post('/task', function(req, res, err) {
    var task = req.body;

    if (!task.title || (task.isDone + "")) {
        sendError(res);
    } else {
        db.tasks.save(task, function(err, task) {
            checkErrOrRenderJSON(err, task);
        });
    }
})

// Delete task
router.delete('/task/:id', function(req, res, next) {
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, task) {
        checkErrOrRenderJSON(err, task);
    });
});

// Update task
router.put('/task/:id', function(req, res, next) {
    var task = req.body;
    var updateTask = {};

    if (task.isDone) {
        updateTask.isDone = task.isDone;
    }

    if (task.title) {
        updateTask.title = task.title;
    }

    if(!updateTask) {
        sendError(res);
    } else {
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)}, updateTask, {}, function(err, task) {
            checkErrOrRenderJSON(err, task);
        });
    }
});

function checkErrOrRenderJSON(err, task) {
    if (err) {
        res.send(err);
    }

    res.json(task);
}

function sendError(res) {
    res.status(400);
    res.json({
        "error": "Bad data"
    });
}

module.exports = router;