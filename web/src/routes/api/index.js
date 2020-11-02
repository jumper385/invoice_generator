import * as db from '../../dbhelpers/mongoosehelpers';
import { WorkLog } from '../../dbhelpers/schemas';

export const get = async (req, res) => {
	res.json(await db.queryCollection(WorkLog));
}

export const post = async (req, res) => {
	res.json(await db.postCollection(WorkLog, req.body));
}

export const put = async (req, res) => {
    let { query, delta } = req.body;
    await db.editCollection(WorkLog, query, delta)
    res.json(await db.queryCollection(WorkLog, query));
}

export const del = async (req, res) => {
	res.json(await db.deleteCollection(WorkLog, req.body));
}