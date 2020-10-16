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

function createNode(t) {
    return document.createElement(t);
}

function removeClassName(d, c){
    d.className = d.className.replace(c, '');
    d.className = d.className.replace(/\s+/ig, ' ');
}

function parseDataFromYD(d) {
    let target = {
        key: window.str
    }
    if(d.hasOwnProperty('err')) {
        console.log(d);
        return d;
    } else {
        let target = [];
        for(let i of d.data) {
            switch (i.type) {
                case 'simple': {
                    let titleContainer = createNode('div');
                    titleContainer.className = 'title_container';
                    let spell = createNode('span');
                    spell.className = 'title_element spell';
                    spell.innerText = i.spell;
                    let title = createNode('div');
                    title.className = 'title_element title';
                    title.innerText = i.title;
                    titleContainer.appendChild(title)
                    titleContainer.appendChild(spell);
                    target.push(titleContainer);
                } break;
                case 'translation': {
                    let translationContainer = createNode('ul');
                    translationContainer.className = 'translation_container';
                    for(let trans of i.translations) {
                        let sel = createNode('li');
                        sel.className = 'sel';
                        let p = createNode('p');
                        p.innerText = trans;
                        sel.appendChild(p);
                        translationContainer.appendChild(sel);
                    }
                    target.push(translationContainer)
                } break;
                default:
                    return '';

            }
        }
        return target;
    }
}

function parseDataFromBaidu(d) {

}
