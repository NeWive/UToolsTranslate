const STRING = {
    GET: 'GET',
    POST: 'POST'
}

/**
 * 将空格替换为%20
 * @param s
 * @returns {string}
 */
function genQuery(s) {
    let str = '';
    s.split(' ').forEach((i, index) => (
        str += `${i}${index < (s.split(' ').length - 1) ? '%20' : ''}`
    ))
    return str;
}

/**
 * 使用axios请求
 * @param method
 * @param url
 * @param conf
 * @returns {Promise<{msg: number, data: *}|{msg: number, error: *}>}
 */
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

/**
 * 根据id获取节点
 * @param i
 * @returns {HTMLElement}
 */
function getNodeById(i) {
    return document.getElementById(i);
}

/**
 * 根据class获取dom节点
 * @param c
 * @returns {*[]}
 */
function getNodeByClass(c) {
    return new Array(...document.getElementsByClassName(c));
}

function addClassName(d, c) {
    d.className += ` ${c}`;
}

function removeClassName(d, c){
    d.className = d.className.replace(c, '');
    d.className = d.className.replace(/\s+/ig, ' ');
}
