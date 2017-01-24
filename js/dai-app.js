$(
    function initMap() {
        map = new google.maps.Map(document.getElementById('Location-map'), {
        center: {lat: 23.5832340, lng: 120.5825975},
        zoom: 3});
    }

);
// https://developers.google.com/maps/documentation/javascript/examples/polyline-simple?hl=zh-tw
/////////////
/////////////
// $(function() function initMap()); Doesn't Work!
$(function(){
        var pinColor = "ffffff";
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));
        var markers = [];
        var interval = 12000; // 1000ms = 1sec
        var output = {lat: 23.5832340, lng:120.5825975};
        var latDom = $('#lat > span');
        var lngDom = $('#lng > span');
        var markersDom = $('#markers > span');
        var centerRead = "" // Set Flag, We only update center once
        var r;
        var g;
        var b;
        var lat;
        var lng;
        var temp_r;
        var temp_g;
        var temp_b;
        var temp_lat;
        var temp_lng;
        var description;
        var EQ_1;
        var EQ_2;
        var parent = [];
        /* var $Name = $('#Name');
        var $Lat = $('#Lat');
        var $Lng = $('#Lng');
        $('#AddLo').on('click', function(){
                             var Location = {Name: $Name.val(),Lat: $Lat.val(), Lng: $Lng.val()};
                             $.ajax({
                             type: 'POST',
                             url: 'http://localhost/GeoLo/index.html',
                             data: Location,
                             success: function(NewLocation){
                             $('#UserData').append('<li>' + Location.Name + '</li>'),
                             addMarker(Location.Lat, Location.Lng);
                             },
                             error: function()
                             {alert('Error');}
                             });
                            }); */
        function Color_I () {
            var arr = [];
            arr.push(r);
            arr.push(g);
            arr.push(b);
            return arr;
        }

        function GeoLo_I () {
            var arr = [];
            arr.push(_lat);
            arr.push(_lng);
            return arr;
        }

        function Description_I(){
            var arr = [];
            arr.push(description);
            return arr;
        }

        function EQ_I(){
            var arr = [];
            arr.push(EQ_1);
            arr.push(EQ_2);
            return arr;
        }

        function Color_O (data)
        {
            r = data[0];
            g = data[1];
            b = data[2];
            
            console.log(data);
            //addMarker(lat, lng);
        }
        function Description_O (data)
        {
            description = data[0];
            console.log(data);
            if((r == temp_r && g == temp_g && b == temp_b) && (lat == temp_lat && lng == temp_lng))
                return;
            else
            {
                temp_r = r;
                temp_b = b;
                temp_g = g;
                temp_lng = lng;
                temp_lat = lat;
            }
            addMarker(lat, lng);

        }
        function EQ_O (data)
        {
            EQ_1 = data[0];
            EQ_2 = data[1];
            console.log(data);
            console.log("data[0]:", data[0]);
            console.log("data[1]:", data[1]);
            addPolyLine(EQ_1, EQ_2);
        }
        function GeoLo_O (data)
        {
            lat = data[0];
            lng = data[1];
            console.log(data);
            console.log("data[0]:", data[0]);
            console.log("data[1]:", data[1]);

        }
        function changepinImage()
        {
            //console.log('hi');

            pinColor = rgbToHex(r,g,b).toString();
            //console.log(pinColor);
            pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));
            //console.log(pinImage);
        }

        function iot_app(){
            r = 40;
            g = 40;
            b = 40;
            
        }
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
            return componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function domUpdater() {
            // Try to only update once
            //gg++;
            //console.log(gg);
            latDom.text(output.lat);
            lngDom.text(output.lng);
            //addMarker(output.lat, output.lng);
            requestAnimationFrame(domUpdater);
        }
        requestAnimationFrame(domUpdater); // Refresh Page

        function addMarker(lat, lng)
        {
            if(lat == 0 && lng == 0)
                return;
            var index;
            index = markers.length;
            var string;
            var _lat = lat;
            var _lng = lng;
            string = '('  + lat + ',' + lng + ')' + '\n';
            //markersDom.append(document.createTextNode(string));
            markersDom.append('<button class=".btn-default delete" value = "'+index+'">'+string+'</button>');
            changepinImage();
            console.log(pinColor);
            var infowindow = new google.maps.InfoWindow(
               {
                   content: description
               });
            var marker = new google.maps.Marker({
                position:{ lat: lat, lng: lng },
                map: map, 
                icon: pinImage,});
            marker.addListener('click', function() {
                               infowindow.open(map, marker);
                               });
            markers.push(marker);

        }
        $(document).on('click', '.delete', function(){
                $(this).remove();
                index = $(this).val();
                markers[index].setMap(null);
            });

        //addMarker(output.lat, output.lng);

        var i = 0, total_Marker = 5;
        function succesiveMarker() {
            console.log('i:'+i);
            if( i < total_Marker )
            {
                addMarker(output.lat+i/100, output.lng+i/100);
                setTimeout( succesiveMarker, 2000 );
                i++;
            }
        }
        //succesiveMarker();
        function setMapOnAll(map) {
          for (var i = 1; i < markers.length; i++) {
            markers[i].setMap(map);
          }
        }
        function clearMarkers() {
          setMapOnAll(null);
        }
        function deleteMarkers() {
          clearMarkers();
          markers = [];
        }

        function moveToLocation(lat, lng, zoom){
            var center = new google.maps.LatLng(lat, lng);
            map.panTo(center);
            map.setZoom(zoom);
        }
        function moveMapCenter() {
            moveToLocation(output.lat , output.lng , 3 );

        } 
        function showPosition(position) {
            output.lat = position.coords.latitude;
            output.lng = position.coords.longitude;
        }
        //var kk = 0;
        function iotUpdater() {
            //console.log(kk);
            if( navigator.geolocation )
            {
                navigator.geolocation.getCurrentPosition(showPosition);
                //deleteMarkers();
                i = 0;
                //succesiveMarker();
            }
        
            //if( window.d_name )
            //  IoTtalk.update(mac, 'Geolocation', [output.lat, output.lng]);
            // Don't Understand
            setTimeout(iotUpdater, interval);
            //requestAnimationFrame(domUpdater);

        }

        function findRoot(EQ)
        {
            var root = -1;
            for (root = EQ; parent[root] >= 0; root = parent[root]);
            return root;
        }

        function unionRoot(EQ1, EQ2)
        {
            var totalNode = parent[EQ1] + parent[EQ2];
            if (parent[EQ1] > parent[EQ2]) // w > v , since value is in negative
            {
                parent[EQ2] = totalNode;
                parent[EQ1] = EQ2;
            }
            else
            {
                parent[EQ1] = totalNode;
                parent[EQ2] = EQ1;
            }
        }

        function addPolyLine(EQ1, EQ2){
            
            if(parent.length <= EQ1 + 1)
                parent.length = EQ1 + 1;
            else if(parent.length <= EQ2 + 1)
                parent.length = EQ2 + 1;

            if (parent[EQ1] == undefined || parent[EQ1] == null) 
                parent[EQ1] = -1;
            if (parent[EQ2] == undefined || parent[EQ2] == null) 
                parent[EQ2] = -1;

            var root_EQ1 = findRoot(EQ1);
            var root_EQ2 = findRoot(EQ2);

            if(root_EQ2 == root_EQ1)
                return;
            else
                unionRoot(EQ1, EQ2);

            var polyCoordinates = [];
            for(var i = 0; i < parent.length; i++){
                if(findRoot(parent[i]) == root_EQ1)
                    polyCoordinates.push(markers[i].position);
            }

            var markersLine = new google.maps.Polyline({
                path: polyCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });

              markersLine.setMap(map);
              //polyCoordinates.length = 0;
        }
        /*$('#id').on('click', function()
            getLocation();
            )
        function getLocation()
        {
            document.getElementById('lat');
            document.getElementById('lng')

        }*/
        setTimeout(iotUpdater, interval); // Will this cause loop?
        //requestAnimationFrame(domUpdater);
        /*
        function detach() {
            window.d_name = null;
            IoTtalk.detach(mac);
        }
        window.onunload = detach;
        window.onbeforeunload = detach;
        window.onclose = detach;
        window.onpagehide = detach;*/ // Didn't use , what's the purpose?
        var profile = {
            'dm_name': 'BulbModified',
            'odf_list': [Color_O, GeoLo_O, Description_O, EQ_O],
            'idf_list': [Color_I, GeoLo_I, Description_I, EQ_I],
        }

        var ida = {
            'iot_app': iot_app,
        }; // How iot device receive data (format)
        dai(profile,ida);
        
});




