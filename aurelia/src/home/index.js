import { HttpClient, json } from 'aurelia-fetch-client';
import { customAttribute, bindable, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

let httpClient = new HttpClient();

@inject(Router)
export class Home {
  constructor(router) {
    this.books = null;
    this.router = router;
  }

  attached() {
    this.fetchBooksFromAPI();
    this.initMap();
  }

  fetchBooksFromAPI() {
    httpClient.fetch('https://bookmarket.online:18081/api/books/getall?city=&conditiondesc=&genreid=2&language=')
      .then(response => response.json())
      .then(data => {
        this.books = data;        
      });
  }

  navigateToBookById(bookid) {
    console.log(bookid);
    this.router.navigateToRoute('bookbyid', {
      id: bookid
    });
  }

  initMap() {
    var centerOfEstonia = {lat: 58.6734464, lng: 25.3135814};

    var marker = new google.maps.Marker({
      position: centerOfEstonia,
      map: this.renderMap()
    });
  }

  renderMap() {
    var centerOfEstonia = {lat: 58.6734464, lng: 25.3135814};

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: centerOfEstonia,
      styles: [
        {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e0efef"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "hue": "#1900ff"
                },
                {
                    "color": "#c0e8e8"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": 700
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#7dcdcd"
                }
            ]
        }
    ]
    });
    
    return map;
  }

}
