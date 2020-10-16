const conf = {
    'YouDao': {
        name: '有道翻译',
        color: '#ef476f'
    },
    'Baidu': {
        name: '百度翻译',
        color: '#118ab2'
    },
    'Google': {
        name: '谷歌翻译',
        color: '#06d6a0'
    },
    'History': {
        name: '翻译历史',
        color: '#ffd166'
    },
    'Info': {
        name: '应用信息',
        color: '#073b4c'
    }
}
const callback = {
    'YouDao': () => {

    },
    'Baidu': () => {

    },
    'Google': () => {

    },
    'History': () => {

    },
    'Info': () => {

    }
}
const DBConf = {
    dbName: 'TranslateLog',
    version: 1
}

function handleSelection() {
    addClassName(getNodeByClass('selection')[0], 'selection_loading')
    setTimeout(() => {
        removeClassName(getNodeByClass('selection')[0], 'selection_loading');
        addClassName(getNodeByClass('selection')[0], 'selection_loaded');
    }, 1300);
}

function requestHandler() {
    console.log('start request');
    reqBaidu().then((d) => {
        console.log(d);
    });
    reqYD().then((d) => {
        // parseDataFromYD(d).forEach((i) => {
        //     getNodeByClass('content')[0].appendChild(i);
        // });
    });
    reqGoogle().then((d) => {
        console.log(d);
    });
}

function init() {
    getNodeById('search').onchange = (e) => {
        window.str = e.target.value;
    }
    getNodeById('search_button').onclick = () => {
        requestHandler();
    }
    getNodeByClass('panel').forEach((i) => {
        i.onclick = (e) => {
            getNodeByClass('content')[0].style.boxShadow = `0 0 0 2px ${conf[e.target.getAttribute('key')].color}`;
        }
    });
    handleSelection();
}

window.utools.onPluginReady(() => {
    init();
});
