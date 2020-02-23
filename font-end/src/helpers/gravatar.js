import axios from 'axios';
import { md5 } from './md5';

const testEmail = md5('example@example.com');

export const CDNs = [
    (k) => `https://www.gravatar.com/avatar/${k}?s=400`,
    (k) => `https://fdn.geekzu.org/avatar/${k}?s=400`,
];

export let bestOne = CDNs[1];

export let getGravatarAddress = (email) => {
    return bestOne(md5(email));
};

export let getGravatarAddress2 = (hash) => {
    return bestOne(hash);
};

export let switchTo = (f) => {
    bestOne = f;
};

let measure = async (avatarAddr) => {
    let t1 = Date.now();
    await axios.get(avatarAddr, {
        headers: {
            "accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        }
    });
    let t2 = Date.now();
    let result = t2 - t1;
    return result;
};

export let autoMeasureBestOne = async () => {
    let mapping = new Map();
    for (let cdnf of CDNs){
        let result = await measure(cdnf(testEmail));
        mapping.set(cdnf, result);
    }
    let best = CDNs[0];
    let bestMs = -1;
    mapping.forEach((ms, cdnf) => {
        if (bestMs == -1){
            bestMs = ms;
            best = cdnf;
        } else if (bestMs > ms){
            bestMs = ms;
            best = cdnf;
        }
    });
    switchTo(best);
    return [best, bestMs];
};

export default {
    CDNs,
    bestOne,
    getGravatarAddress,
    getGravatarAddress2,
    switchTo,
    autoMeasureBestOne
};
