import axios from "axios";

export async function getCover(type = 1) {
    const res = await axios.get('/api/cover/getCover.do', {params: {type}});
    return res;
}

export async function getRecordList(type = 1, page = 1, pageSize = 6) {
    const res = await axios.get('/api/album/getRecordList.do', {params: {type, page, pageSize}});
    return res;
}

export async function getSongList(songIds) {
    const res = await axios.post('/api/album/getSongList.do', {songIds: songIds});
    return res;
}