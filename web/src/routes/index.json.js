import * as db from '../dbhelpers/mongoosehelpers';
import { WorkLog } from '../dbhelpers/schemas';

export const get = async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(await JSON.stringify(await db.queryCollection(WorkLog,req.body)))
}