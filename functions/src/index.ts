/*
 *  This program is free software: you can redistribute it and/or modify it
 *  under the terms of the Affero GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or (at your
 *  option) any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE.  See the Affero GNU General Public
 *  License for more details.
 *
 *  You should have received a copy of the Affero GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import fetch from 'node-fetch';
import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const hello = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const shield_docker = functions.https.onRequest ((request, response) => {
    // response.send("Hello from Firebase!");
    fetch ("https://api.microbadger.com/v1/images/conao3/po4a")
        .then (res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('error');
        })
        .then (resjson => {
            response.send(JSON.stringify(resjson));
        })
        .catch (error => {
            response.send(JSON.stringify({ type: 'error' }));
        });
});

import * as moment from 'moment';
const cors = require('cors')({
    origin: true,
});

export const date = functions.https.onRequest ((req, res) => {
    if (req.method === 'PUT') {
        return res.status(403).send('Forbidden!');
    }
    return cors(req, res, () => {
        let format = req.query.format;
        if (!format) {
            format = req.body.format;
        }
        const formattedDate = moment().format(format);
        console.log('Sending Formatted date:', formattedDate);
        res.status(200).send(formattedDate);
    });
});
