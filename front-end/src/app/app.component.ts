import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  title = 'Nara';
  public port = '192.168.1.20'
  constructor(private appservice : AppService) {

  }
  ngOnInit() {
    console.log('init')
    this.appservice
      .updateApp();
  }
}
