(function () {

    function thru(action) {
        return result => {
            action(result);
            return result;
        }
    }

    window.thru = thru;
})();