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
import * as prettyBytes from 'pretty-bytes';
import * as jp from 'jsonpath';
import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const shield_docker_svg = (leftstr:string, rightstr:string, width:number, leftwidth:number, color:string) => {
    const leftcenter = leftwidth + (width-leftwidth)/2;
    const result = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20">
<g>
<rect x="0" y="0" width="100%" height="100%" fill="#${color}"></rect>
<rect x="0" y="0" width="${leftwidth}" height="100%" fill="#555"></rect>
</g>
<g fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
<text x="5" y="14">${leftstr}</text>
<text x="${leftcenter}" y="14" text-anchor="middle">${rightstr}</text>
</g>
</svg>`;
    return result;
};

const github_header_svg = (str:string) => {
    const result = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="170">
<style xmlns="http://www.w3.org/2000/svg" type="text/css">
@import url('https://fonts.googleapis.com/css?family=Sarabun:100');
text {font-size: 70px; font-family: 'Sarabun', sans-serif; font-weight: 100;}
</style>
<g>
<rect x="0" y="0" width="100%" height="100%" fill="#222"></rect>
</g>
<g fill="#fff" font-family="Open Sans">
<text x="90" y="120" font-size="50">${str}</text>
</g>
</svg>`;
    return result;
};

export const hello = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const hello_args = functions.https.onRequest((request, response) => {
    if (request.path !== "/") {
        const param = request.path.split('/')[1];
        response.send("Hello from Firebase!" + param);
    } else {
        response.send("Hello from Firebase!");
    }
});

export const shield_docker = functions.https.onRequest ((request, response) => {
    // response.send("Hello from Firebase!");
    const args = request.path && request.path.split('/');
    const username = args[1];
    const imagename = args[2];
    const badgetype = args[3];
    const color = request.query.color || "007ec6";

    response.type('svg');

    fetch (`https://api.microbadger.com/v1/images/${username}/${imagename}`)
        .then (res => {
            if (!res.ok) {
                console.error(`Fail accessed https://api.microbadger.com/v1/images/${username}/${imagename}`);
                throw new Error('error');
            }
            return res.json();
        })
        .then (resjson => {
            // response.send(`${jp.query(resjson, "$.DownloadSize")}`);
            let leftstr:string;
            let leftwidth:number;
            let rightstr:string;

            switch (badgetype) {
                case "name":
                    leftstr = "docker image";
                    leftwidth = 86;
                    rightstr = `${jp.query(resjson, "$.ImageName")}`;
                    break;
                case "layers":
                    leftstr = "docker layers";
                    leftwidth = 86;
                    rightstr = `${jp.query(resjson, "$.LayerCount")} layers`;
                    break;
                case "size":
                    leftstr = "docker size";
                    leftwidth = 75;
                    rightstr = prettyBytes(Number(jp.query(resjson, "$.DownloadSize")))
                    break;
                case "version":
                    leftstr = "docker version";
                    leftwidth = 92;
                    rightstr = `v${jp.query(resjson, "$.LatestVersion")}`;
                    break;
                case "pulls":
                    leftstr = "docker pulls";
                    leftwidth = 80;
                    rightstr = `${jp.query(resjson, "$.PullCount")}`;
                    break;
                case "stars":
                    leftstr = "docker stars";
                    leftwidth = 80;
                    rightstr = `${jp.query(resjson, "$.StarCount")}`;
                    break;
                default:
                    leftstr = "docker unknown";
                    leftwidth = 101;
                    rightstr = "unknown"
                    console.info(`unknown type ${badgetype} on ${username}/${imagename}`);
            }
            console.info(`${badgetype} on ${username}/${imagename}`);
            response.send(shield_docker_svg(
                leftstr, rightstr, 170, leftwidth, color));
        })
        .catch (error => {
            response.send(shield_docker_svg("docker unknown", "unknown", 170, 86, color));
        });
});

export const github_header = functions.https.onRequest ((req, res) => {
    const str = req.path !== '/' ? req.path.split('/')[1] : "github-header";

    res.type('svg');
    res.send(github_header_svg(str));
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
