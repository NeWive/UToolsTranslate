window.browser = utools.ubrowser;
window.str = '';

async function reqBaidu() {
    // food
    // red a
    // kksk
    let q = window.str;
    try {
        let d = await window.browser.goto(`https://fanyi.baidu.com/#en/zh/${genQuery(q)}`)
            .wait('.target-output')
            .evaluate(() => {
                let title = document.getElementsByTagName('textarea')[0].value;
                let spell = document.getElementsByClassName('target-output')[0].getElementsByTagName('span')[0].innerText;
                return {
                    title,
                    spell,
                    msg: 1
                }
            })
            .when('.simple-dict')
            .evaluate(() => {
                function handleCorrectBaiduRes() {
                    function handleComments() {
                        let pa = new Array(...document.getElementsByClassName('dictionary-comment')[0].getElementsByTagName('p'));
                        return pa.map((i) => {
                            let type = i.getElementsByTagName('b')[0].innerText;
                            let content = new Array(...i.getElementsByTagName('span')).filter((i) => {
                                return i.className !== 'dict-margin';
                            }).map((i) => (
                                i.innerText
                            ));
                            return {
                                type,
                                content
                            }
                        });
                    }

                    let comment = handleComments();
                    return {
                        msg: 1,
                        translations: comment,
                        type: 'common'
                    };
                }

                return handleCorrectBaiduRes();
            })
            .end()
            .when('.keywords-inner')
            .evaluate(() => {
                function handleKeyWord() {
                    let box = new Array(...document.getElementsByClassName('keywords-content-text-ellipsis'));
                    return box.map((i) => {
                        let name = i.getElementsByClassName('keywords-word')[0].innerText;
                        let means = new Array(...i.getElementsByClassName('keywords-mean')).map((i) => (
                            i.innerText
                        ));
                        return {
                            name,
                            means
                        }
                    });
                }

                let keywords = handleKeyWord();
                return {
                    msg: 1,
                    keywords,
                    type: 'keyword'
                }
            })
            .end()
            .run({
                show: false
            });
        return {
            data: d,
            from: 'baidu'
        }
    } catch (e) {
        return {
            msg: 0,
            err: e,
            tips: 'parsing content error',
            from: 'baidu'
        };
    }
}

async function reqGoogle() {
    let q = window.str;
    try {
        let data = await window.browser.goto(`https://translate.google.cn/#view=home&op=translate&sl=en&tl=zh-CN&text=${genQuery(q)}`)
            .wait('.tlid-translation')
            .evaluate(() => {
                let title = document.getElementById('source').value;
                let spell = document.getElementsByClassName('tlid-translation')[0].getElementsByTagName('span')[0].innerText;
                return {
                    title,
                    spell,
                    msg: 1
                }
            })
            .when('.gt-baf-table')
            .evaluate(() => {
                let list = new Array(...document.getElementsByClassName('gt-baf-table')[0].getElementsByTagName('tr'));
                let index = -1;
                let tempList = [];
                let o = [];
                list.forEach((i) => {
                    console.log(i);
                    if(/gt-baf-entry/.test(i.className)) {
                        let t = i.getElementsByTagName('td');
                        o[index].list.push({
                            spell: t[0].getElementsByClassName('gt-baf-cell')[0].innerText,
                            similar: new Array(...t[1].getElementsByClassName('gt-baf-back')).map((i) => (
                                i.innerText
                            ))
                        })
                    } else {
                        tempList.push(i.getElementsByClassName('gt-cd-pos')[0].innerText);
                        o.push({
                            type: tempList[++index],
                            list: []
                        });
                    }
                });
                return {
                    msg: 1,
                    translations: o
                }
            })
            .end()
            .when('.gt-def-list')
            .evaluate(() => {
                let tempList = [];
                let o = [];
                let index = -1;
                new Array(
                    ...document.getElementsByClassName('gt-cd-mmd')[0]
                        .getElementsByClassName('gt-cd-c')[0]
                        .children
                )
                    .forEach((i) => {
                        console.log(i);
                        if(/gt-cd-pos/.test(i.className)) {
                            tempList.push(i.innerText);
                            o.push({
                                type: tempList[++index],
                                definitions: []
                            });
                        } else if(/gt-def-list/.test(i.className)) {
                            new Array(...i.getElementsByClassName('gt-def-info')).forEach((item) => {
                                let objTemp = {
                                    def: item.getElementsByClassName('gt-def-row')[0].innerText
                                }
                                try {
                                    objTemp['example'] = item.getElementsByClassName('gt-def-example')[0].getElementsByTagName('q')[0].innerText
                                } catch (e) {

                                }
                                o[index].definitions.push(objTemp);
                            });
                        }
                    });
                return {
                    msg: 1,
                    definitions: o
                }
            })
            .end()
            .run({
                show: false
            })
        return {
            data,
            from: 'google'
        }
    } catch (e) {
        return {
            msg: 0,
            err: e,
            tips: 'parsing content error',
            from: 'google'
        };
    }
}

async function reqYD() {
    try {
        let data = await window.browser.goto(`http://fanyi.youdao.com/?q=${window.str}`)
            .wait('#inputOriginal')
            .evaluate(() => {
                document.querySelector('#inputOriginal').value = window.location.search.split('=')[1];
            })
            .click('#transMachine')
            .wait(1500)
            .evaluate(() => {
                let spell = document.querySelector('#transTarget p span').innerText;
                let title = document.getElementById('inputOriginal').value;
                return {
                    spell,
                    title,
                    msg: 1
                }
            })
            .evaluate(() => {
                let t = document.getElementsByClassName('input__target__dict')[0];
                if(/block/.test(t.style.display)) {
                    return {
                        msg: 1,
                        translations: new Array(...document.getElementsByClassName('no-link')).map((i) => (
                            i.innerText
                        ))
                    }
                }
            })
            .run({
                show: false
            });
        return {
            data,
            from: 'YD'
        }
    } catch (e) {
        return {
            msg: 0,
            err: e,
            tips: 'parsing content error',
            from: 'YD'
        };
    }
}

// test module
(function init() {
    document.getElementById('nibaba').onclick = async () => {
        console.log(await reqYD());
    };
})()
