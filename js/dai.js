const dai = function (profile, ida) {
    var df_func = {};
    var mac_addr = (function () {
        function s () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s() + s() + s();
    })();

    // Not Sure
    if (profile.is_sim == undefined){
        profile.is_sim = false;
    }
    //

    /*function setUpName(dfList)
    {
        for (var i = 0; i < dfList.length; i++) {
            df_name = dfList[i].name.replace(/_/g, '-')
            df_func[df_name] = dfList[i];
            console.log(df_func[df_name]);
            dfList[i] = df_name;
            console.log(df_name);
        }
    }

    setUpName(profile.odf_list);
    setUpName(profile.idf_list);*/
    for (var i = 0; i < profile.idf_list.length; i++) {
        df_name = profile.idf_list[i].name.replace(/_/g, '-')
        df_func[df_name] = profile.idf_list[i];
        profile.idf_list[i] = df_name;
        console.log(df_name);
    }

    for (var i = 0; i < profile.odf_list.length; i++) {
        df_name = profile.odf_list[i].name.replace(/_/g, '-')
        df_func[df_name] = profile.odf_list[i];
        profile.odf_list[i] = df_name;
        console.log(df_name);
    }


    function pull (odf_name, data) {
        if (odf_name == 'Control') {
            switch (data[0]) {
            case 'SET_DF_STATUS':
                dan.push('Control', ['SET_DF_STATUS_RSP', data[1]], function (res) {});
                break;
            case 'RESUME':
                ida.suspended = false;
                dan.push('Control', ['RESUME_RSP', ['OK']], function (res) {});
                break;
            case 'SUSPEND':
                ida.suspended = true;
                dan.push('Control', ['SUSPEND_RSP', ['OK']], function (res) {});
                break;
            }
        } else {
            df_func[odf_name](data);
        }
    }

    function init_callback (result) {
        console.log('register:', result);
        document.title = profile.d_name;
        ida.iot_app();
    }

    function deregisterCallback (result) {
        console.log('deregister:', result);
    }

    function deregister () {
        dan.deregister(deregisterCallback);
    }

    window.onunload = deregister;
    window.onbeforeunload = deregister;
    window.onclose = deregister;
    window.onpagehide = deregister;
    console.log('call dan lo');
    dan.init(pull, csmapi.get_endpoint(), mac_addr, profile, init_callback);
};
