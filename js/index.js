

function handleSelection() {
    addClassName(getNodeByClass('selection')[0], 'selection_loading')
    setTimeout(() => {
        removeClassName(getNodeByClass('selection')[0], 'selection_loading');
        addClassName(getNodeByClass('selection')[0], 'selection_loaded');
    }, 1300);
}

utools.onPluginReady(() => {
    handleSelection();
});
