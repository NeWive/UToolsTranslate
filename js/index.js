const mapToCN = {
    'YouDao': '有道翻译',
    'Baidu': '百度翻译',
    'Google': '谷歌翻译',
    'History': '翻译历史',
    'Info': '应用信息'
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

window.utools.onPluginReady(() => {
    handleSelection();
});
