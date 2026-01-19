import Hashids  from "hashids";


const hashids = new Hashids(process.env.HASH_ID_SECRET,8);

export const encodeId = (id) => {
    return hashids.encode(id);
}

export const decodeId = (id) => {
    const decode =  hashids.decode(id);

    return decode.length ? decode[0] : nulll
}