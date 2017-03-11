(function () {
    // Ensure we only run once per page
    if (window.SAMBURBA_TOTHECOMMENTS_INFO_BAR_LOADED) {
        return;
    }
    window.SAMBURBA_TOTHECOMMENTS_INFO_BAR_LOADED = true;

    const MESSAGE_TIMEOUT_MS = 6000;
    const INFO_BAR = createInfoBar();

    let timeoutId;

    chrome.runtime.onMessage.addListener(showMessage);

    function showMessage(message) {
        INFO_BAR.classList.remove('samburba-tothecomments-hidden');
        INFO_BAR.textContent = message;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(hide, MESSAGE_TIMEOUT_MS);
    }

    function hide() {
        INFO_BAR.classList.add('samburba-tothecomments-hidden')
    }

    function createInfoBar() {
        let bar = document.createElement('div');
        bar.setAttribute('id', 'samburba-tothecomments-info-bar');
        bar.classList.add('samburba-tothecomments-alert');
        bar.classList.add('samburba-tothecomments-alert-info');
        bar.classList.add('samburba-tothecomments-hidden');
        document.body.insertBefore(bar, document.body.firstChild);
        return bar;
    }
})();
