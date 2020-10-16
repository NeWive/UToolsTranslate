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

function genSimple(i) {
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
    return titleContainer;
}

function parseDataFromYD(d) {
    if(d.hasOwnProperty('err')) {
        console.log(d);
        return d;
    } else {
        let target = [];
        for(let i of d.data) {
            switch (i.type) {
                case 'simple': {
                    target.push(genSimple(i));
                } break;
                case 'translation': {
                    let translationContainer = createNode('ul');
                    translationContainer.className = 'translation_container';
                    for(let trans of i.translations) {
                        let sel = createNode('li');
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
    if(d.hasOwnProperty('err')) {
        console.log(d);
        return d;
    } else {
        let target = [];
        for(let i of d.data) {
            switch (i.type) {
                case 'simple': {
                    target.push(genSimple(i));
                } break;
                case 'detail': {
                    let ul = createNode('ul');
                    ul.className = 'translation_container';
                    for(let e of i.translations) {
                        let str = `${e.type} `;
                        for(let c of e.content) {
                            str += `${c}; `
                        }
                        let li = createNode('li');
                        let p = createNode('p');
                        p.innerText = str;
                        li.appendChild(p);
                        ul.appendChild(li);
                    }
                    target.push(ul);
                } break;
                case 'keyword': {
                    let ul = createNode('ul');
                    ul.className = 'translation_container';
                    for(let e of i.keywords) {
                        let str = `${e.name}: `;
                        for(let c of e.means) {
                            str += `${c}; `
                        }
                        let li = createNode('li');
                        let p = createNode('p');
                        p.innerText = str;
                        li.appendChild(p);
                        ul.appendChild(li);
                    }
                    target.push(ul);
                } break;
                default:
                    break;
            }
        }
        return target;
    }
}

function parseDataFromGoogle(d) {
    if(d.hasOwnProperty('err')) {
        console.log(d);
        return d;
    } else {
        let target = [];
        for(let i of d.data) {
            switch (i.type) {
                case 'simple': {
                    target.push(genSimple(i));
                } break;
                case 'translate': {
                    let ul = createNode('ul');
                    ul.className = 'translation_container';
                    for(let e of i.translations) {
                        let str = `${e.type}`;
                        let translate_type = createNode('li');
                        translate_type.className = 'translate_type';
                        translate_type.innerText = str;
                        ul.appendChild(translate_type);
                        for(let c of e.list) {
                            let translate_content_box = createNode('li');
                            translate_content_box.className = 'translate_content_box';
                            let translate_content = createNode('span');
                            translate_content.className = createNode('translate_content');
                            translate_content.innerText = `${c.spell}: `;
                            translate_content_box.appendChild(translate_content);
                            let str = '';
                            c.similar.forEach((a) => {
                                str += `${a}; `;
                            });
                            let similar = createNode('span');
                            similar.className = 'similar';
                            similar.innerText = str;
                            translate_content_box.appendChild(similar);
                            ul.appendChild(translate_content_box);
                        }
                    }
                    target.push(ul);
                } break;
                case 'definition': {
                    let ul = createNode('ul');
                    ul.className = 'translation_container';
                    for(let e of i.definitions) {
                        let head = createNode('li');
                        let content = createNode('p');
                        head.className = 'definition_type';
                        content.innerText = e.type;
                        head.appendChild(content);
                        for(let a of e.definitions) {
                            let h = createNode('li');
                            let definition_content = createNode('p');
                            definition_content.className = 'definition_content';
                            definition_content.innerText = a.def;
                            h.appendChild(definition_content);
                            let example = createNode('p');
                            example.className = 'definition_example';
                            example.innerText = `example: ${e.example}`
                            h.appendChild(example);
                            head.appendChild(h);
                        }
                        ul.appendChild(head);
                    }
                    target.push(ul);
                } break;
                default:
                    break;
            }
        }
        return target;
    }
}
