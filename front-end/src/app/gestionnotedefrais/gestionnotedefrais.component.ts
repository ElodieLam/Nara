import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { GestionnotedefraisService } from './gestionnotedefrais.service';
import { INotedefrais, FilterGroup } from './gestionnotedefrais.interface';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 

@Component({
  selector: 'app-gestionnotedefrais',
  templateUrl: './gestionnotedefrais.component.html',
  styleUrls: ['./gestionnotedefrais.component.css']
})
/**
 * Responsable : Alban Descottes
 * Component qui représente toutes les notes de frais qui sont visualisable par un chef de service 
 * Accessible pour tous les chefs de service
 * Version mobile et ordinateur
 */
export class GestionnotedefraisComponent implements OnInit {

  id_cds:number;
  listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  dataSource;
  displayedColumns: string[] = ['service', 'nom', 'date', 'nb_lignes', 'voir'];
  dataSourceMobile;
  displayedColumnsMobile: string[] = ['ndf'];
  listNotedefrais: INotedefrais[] = [];
  listCollab: String[] = [];
  listService: String[] = [];
  collab:String;
  service:String;
  filter:String;
  mobileVersion:boolean = false;
  sub : any;
  filterGroup: FilterGroup[];

  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private gestionnotedefraisService : GestionnotedefraisService,
    private login : LoginComponent, private router : Router) {
      this.mobileVersion = this.login.mobileVersion
     }

  ngOnInit() {
    this.id_cds = this.login.user.id_collab;
    this.listNotedefrais = [];
    this.sub = this.gestionnotedefraisService
      .getNotedefraisFromIdCds({id : this.id_cds})
      .subscribe( (data : INotedefrais[]) => {
        this.listNotedefrais = data;
        this.listCollab = this.listNotedefrais.reduce(function (a,b) {
          if (a.indexOf(b.prenom_collab + ' ' + b.nom_collab) == -1) {
            a.push(b.prenom_collab + ' ' + b.nom_collab)
          }
          return a;
        }, []);
        this.listService = this.listNotedefrais.reduce(function (a,b) {
          if (a.indexOf(b.nom_service) == -1) {
            a.push(b.nom_service)
          }
          return a;
        }, []);
        this.filterGroup = [ 
          {
            name : 'Collaborateur',
            values : this.listCollab
          },
          {
            name : 'Service',
            values : this.listService
          }
        ]
        this.listNotedefrais.forEach(ndf => {
          if(ndf.cnt == null) {
            ndf.cnt = 0;
          }
        });
        this.listNotedefrais.sort((a, b) => {   
          return b.cnt.valueOf() - a.cnt.valueOf() || b.annee.valueOf() - a.annee.valueOf() || b.mois.valueOf() - a.mois.valueOf();
        });
        if(this.mobileVersion) {
          this.dataSourceMobile = new MatTableDataSource<INotedefrais>(this.listNotedefrais);
          this.dataSourceMobile.paginator = this.paginator;
        }
        else {
          this.dataSource = new MatTableDataSource<INotedefrais>(this.listNotedefrais);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
    });
  }

  onChange() {
    if(this.filter != null) {
      if(this.mobileVersion) 
        this.dataSourceMobile.filter = this.filter.split(" ", 2)[0].trim().toLowerCase();
      else
        this.dataSource.filter = this.filter.split(" ", 2)[0].trim().toLowerCase();
    }
    else {
      if(this.mobileVersion)
        this.dataSourceMobile.filter = '';
      else
        this.dataSource.filter = '';
    }
  }

  goToGestionlignedefrais(element : any) {

    var hiddenParam = element.id_ndf + '-' + element.prenom_collab + '-' + element.nom_collab + '-' 
      + this.listemois[element.mois] + '-' + element.annee + '-' + element.id_send;
    var encrypted = this.encrypt(hiddenParam, this.key);
    this.router.navigate(['/gestionnotedefrais',  encrypted.toString()  ]);
  }

  encrypt (msg, key) {
    var salt = CryptoJS.lib.WordArray.random(128/8);
    var key = CryptoJS.PBKDF2(key, salt, {
        keySize: this.keySize/32,
        iterations: this.iterations
      });
    var iv = CryptoJS.lib.WordArray.random(128/8);
    var encrypted = CryptoJS.AES.encrypt(msg, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC

    });
    var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
    return transitmessage;
  }

}
