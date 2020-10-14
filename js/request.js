const STRING = {
    GET: 'GET',
    POST: 'POST'
}
let browser = utools.ubrowser;
window.browser = browser;
window.str = '';

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36 Edg/86.0.622.38';

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

async function reqGoogle(q) {
    q = 'google and pip';
    // let q = genQuery(s);
    // console.log(s);
    let conf = {
        params: {
            client: 'gtx',
            sl: 'en',
            tl: 'zh-CN',
            dt: 't',
            q
        },
        // headers: {
        //     'User-Agent': userAgent
        // }
    }
    let res = await request('GET', `http://translate.google.cn/translate_a/single`, conf);
    if (res.msg) {
        try {
            let targetArr = res.data[0][0];
            return {
                msg: 1,
                source: targetArr[1],
                res: targetArr[0]
            }
        } catch (e) {
            return {
                msg: 0,
                error: e
            }
        }
    } else {
        return res;
    }
}

async function reqBaidu() {
    let q = window.str;
    let prom = await window.browser.goto(`https://fanyi.baidu.com/#en/zh/${genQuery(q)}`)
        .wait('.target-output')
        .evaluate(() => {
            let title = document.getElementsByTagName('textarea')[0].value;
            let spell = document.getElementsByClassName('target-output')[0].getElementsByTagName('span')[0].innerText;
            return {
                title,
                spell
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
                    comments: comment,
                    type: 'common'
                };

                try {

                } catch (e) {
                    return {
                        msg: 0,
                        err: e,
                        tips: 'parsing content error'
                    };
                }
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
    console.log(prom);
}

// test module
(function init() {
    document.getElementById('nibaba').onclick = reqBaidu;
})()
