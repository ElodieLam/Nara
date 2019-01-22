import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lignedefrais',
  templateUrl: './lignedefrais.component.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class LignedefraisComponent implements OnInit {

  constructor(private route : ActivatedRoute) { }

  id: number = 0;
  private sub: any;
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
