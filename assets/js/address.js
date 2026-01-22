
    let map, geocoder, marker;

    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 19.076, lng: 72.8777 },
            zoom: 12,
            styles: [
                { elementType: "geometry", stylers: [{ color: "#000" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#f5c518" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#000" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] }
            ]
        });

        geocoder = new google.maps.Geocoder();

        map.addListener("click", (event) => {
            setMarkerAndAddress(event.latLng);
        });
    }

    function searchLocation() {
        const address = document.getElementById("searchInput").value.trim();
        if (!address) {
            alert("Please enter a location to search.");
            return;
        }
        geocoder.geocode({ address: address }, function (results, status) {
            if (status === "OK") {
                const loc = results[0].geometry.location;
                map.setCenter(loc);
                map.setZoom(15);
                setMarkerAndAddress(loc);
            } else {
                alert("Location not found: " + status);
            }
        });
    }

    function setMarkerAndAddress(latLng) {
        if (marker) marker.setMap(null);
        marker = new google.maps.Marker({
            position: latLng,
            map: map
        });

        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
                const address = results[0].address_components;
                document.getElementById("street").value = results[0].formatted_address || "";

                address.forEach((comp) => {
                    const types = comp.types;
                    if (types.includes("locality")) document.getElementById("city").value = comp.long_name;
                    if (types.includes("administrative_area_level_1"))
                        document.getElementById("state").value = comp.long_name;
                    if (types.includes("postal_code")) document.getElementById("pincode").value = comp.long_name;
                });

                const mapLink = `https://www.google.com/maps/search/?api=1&query=${latLng.lat()},${latLng.lng()}`;
                document.getElementById("maplink").value = mapLink;
            }
        });
    }

