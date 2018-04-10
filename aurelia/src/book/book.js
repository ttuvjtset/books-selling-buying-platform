import { HttpClient, json } from 'aurelia-fetch-client';
import { customAttribute, bindable, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Connector } from 'auth/connector';
import { Authorization } from 'auth/authorization';

let httpClient = new HttpClient();

@inject(Router, Connector, Authorization)
export class Book {

  constructor(router, connector, authorization) {
    this.bookbyid = null;
    this.router = router;
    this.connector = connector;
    this.authorization = authorization;
    this.loggedIn = false;
  }

  activate(params) {
    this.id = params.id;
  }

  attached() {
    this.fetchBookByIdFromAPI();

    $(window).on('popstate', function (event) { 
      $.featherlight.current().close(); 
    }); 
  }

  fetchBookByIdFromAPI() {
    this.authorization.isLoggedIn().then(data => {
      let apiURL = 'https://bookmarket.online:18081/api/books/getinfoid?id=' + this.id;
      if (!data.errors) {
        this.loggedIn = true;
        let userSession = this.authorization.getSessionID();
        apiURL += "&session=" + userSession;
      }
      httpClient.fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        this.bookbyid = data;
      });
    });
  }

  ifJSONAttributeIsNull(text) {
    return text === null;
  }

  convertUnixTimeStamp(unixTimeStamp) {
    let date = new Date(unixTimeStamp);
    let options = { day: 'numeric', month: 'long', year: 'numeric' };
    return "Added " + date.toLocaleTimeString('en-GB', options);
  }

  addToWatchList() {
    if (!this.connector.loggedIn) {
      this.router.navigateToRoute('login');
    } else {
      let userSession = this.authorization.getSessionID();
      httpClient.fetch('https://bookmarket.online:18081/api/users/addtowatchlist?session=' + userSession + "&bookid=" + this.id)
      .then(response => response.json())
        .then(data => {
          if (data.errors.length === 0) {
            $.uiAlert({
              textHead: 'Success!',
              text: 'Book successfully added to My Watchlist!',
              bgcolor: '#19c3aa',
              textcolor: '#fff',
              position: 'bottom-left',
              icon: 'checkmark box',
              time: 4,
            })
          } else if (data.errors.includes("FAIL_EXISTS_BOOKID")) {
            $.uiAlert({
              textHead: 'Error adding',
              text: 'You have already this book in your Watchlist',
              bgcolor: '#55a9ee',
              textcolor: '#fff',
              position: 'bottom-left',
              icon: 'info circle',
              time: 4,
            })
          } else {
            $.uiAlert({
              textHead: 'API error',
              text: 'Book could not be added to My Watchlist',
              bgcolor: '#F2711C',
              textcolor: '#fff',
              position: 'bottom-left',
              icon: 'warning sign',
              time: 4,
            })
          }
        });
    }
  }

}
