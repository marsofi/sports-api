const express = require('express');
const router = express.Router();
const {
    ListSports
} = require('./model');


router.get('/list-sports', (req, res, next) => {

    ListSports.get()
        .then(sports => {
            res.status(200).json({
                message: 'Successfully sending the list of sports',
                status: 200,
                sports: sports
            });
        }).catch(err => {
            res.status(500).json({
                message: `Internal server error.`,
                status: 500
            });
            return next();

        });
});


router.post('/post-sport', (req, res, next) => {

    let requiredFields = ['id', 'name'];

    for (let i = 0; i < requiredFields.length; i++) {
        let currentField = requiredFields[i];

        if (!(currentField in req.body)) {
            res.status(406).json({
                message: `Missing field ${currentField} in body.`,
                status: 406
            });
            return next();
        }
    }

    let objectToAdd = {
        id: req.body.id,
        name: req.body.name
    };

    ListSports.post(objectToAdd)
        .then(sport => {
            res.status(201).json({
                message: "Successfully added the sport",
                status: 201,
                sport: sport
            });
        })
        .catch(err => {
            res.status(500).json({
                message: `Internal server error.`,
                status: 500
            });
            return next();
        });
});

router.get('/list-sports/:id', (req, res) => {
    let sportId = req.params.id;

    ListSports.getById(sportId)
        .then(sport => {
            res.status(200).json({
                message: "Successfully sent the sport",
                status: 200,
                sport: sport
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Sport not found in the list",
                status: 404
            });
        });
});

router.put('/update-sport/:id', (req, res) => {
    let requiredFields = ['name'];

    for (let i = 0; i < requiredFields.length; i++) {
        let currentField = requiredFields[i];

        if (!(currentField in req.body)) {
            res.status(406).json({
                message: `Missing field ${currentField} in body.`,
                status: 406
            });
            next();
        }
    }

    let sportId = req.params.id;

    if (sportId) {
        let updatedFields = {
            name: req.body.name
        };

        ListSports.put(sportId, updatedFields)
            .then(sport => {
                res.status(200).json({
                    message: "Successfully updated the sport",
                    status: 200,
                    sport: sport
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Sport not found in the list",
                    status: 404
                });

                next();
            });
    } else {
        res.status(406).json({
            message: "Missing param 'id'",
            status: 406
        });

        next();
    }
});

router.delete('/remove-sport/:id', (req, res) => {
    let requiredFields = ['id'];

    for (let i = 0; i < requiredFields.length; i++) {
        let currentField = requiredFields[i];

        if (!(currentField in req.body)) {
            res.status(406).json({
                message: `Missing field ${currentField} in body.`,
                status: 406
            });

            next();
        }
    }
    let sportId = req.params.id;

    if (sportId) {
        if (sportId == req.body.id) {

            ListSports.delete(sportId)
                .then(sport => {
                    res.status(204).json({
                        message: "Successfully deleted the sport",
                        status: 204,
                        sport: sport
                    });
                })
                .catch(err => {
                    res.status(404).json({
                        message: "Sport not found in the list",
                        status: 404
                    }).send("Finish");
                })

        } else {
            res.status(400).json({
                message: "Param and body do not match",
                status: 400
            });

            next();
        }
    } else {
        res.status(406).json({
            message: "Missing param 'id'",
            status: 406
        });

        next();
    }
});

module.exports = router;



/*
app.get('/list-sports-with-headers', (req, res) =>{
	let sportId = req.get('id');
	sportsArray.forEach(item => {
		if (item.id == sportId){
			res.status(200).json({
				message : "Successfully sent the sport",
				status : 200,
				sport : item
			});
		}
	});
	res.status(404).json({
		message : "Sport not found in the list",
		status : 404
	});
});
*/