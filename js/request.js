window.browser = utools.ubrowser;
window.str = '';
// TODO: parse translate.google.cn
// TODO: handle youdao translate page

async function reqBaidu() {
    let q = window.str;
    try {
        return await window.browser.goto(`https://fanyi.baidu.com/#en/zh/${genQuery(q)}`)
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
    } catch (e) {
        return {
            msg: 0,
            err: e,
            tips: 'parsing content error'
        };
    }
}

async function reqGoogle() {

}

async function reqYD() {

}

// test module
(function init() {
    document.getElementById('nibaba').onclick = async () => {
        console.log(await reqBaidu());
    };
})()
