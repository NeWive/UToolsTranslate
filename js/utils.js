const STRING = {
    GET: 'GET',
    POST: 'POST'
}

function genQuery(s) {
    let str = '';
    s.split(' ').forEach((i, index) => (
        str += `${i}${index < (s.split(' ').length - 1) ? '%20' : ''}`
    ))
    return str;
}

async function request(method, url, conf) {
    try {
        let {data} = await axios({
            method,
            url,
            ...conf
        });
        return {
            msg: 1,
            data
        }
    } catch (e) {
        return {
            msg: 0,
            error: e
        }
    }
}
