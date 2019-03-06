import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ServicecomptaService } from './servicecompta.service';
import { INotedefrais, FilterGroup } from './servicecompta.interface';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 


@Component({
  selector: 'app-servicecompta',
  templateUrl: './servicecompta.component.html',
  styleUrls: ['./servicecompta.component.css']
})
/**
 * Responsable : Alban Descottes
 * Component qui affiche la page de gestion du service compta
 * Accessible pour le service compta
 * Version mobile et oridinateur
 */
export class ServicecomptaComponent implements OnInit {

  id_cds:number;
  listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  displayedColumns: string[] = ['service', 'nom', 'date', 'nb_lignes', 'voir'];
  listNotedefrais: INotedefrais[] = [];
  dataSource;
  
  dataSourceMobile;
  displayedColumnsMobile: string[] = ['ndf'];
  
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
  constructor(private servicecomptaService : ServicecomptaService,
    private login : LoginComponent, private router : Router) {
      this.mobileVersion = this.login.mobileVersion;
     }

  ngOnInit() {
    this.id_cds = this.login.user.id_collab;
    this.servicecomptaService
      .getNotedefraisToCompta({ id : this.login.user.id_collab, isCds : this.login.user.isCDS ? true : false })
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

    var hiddenParam = element.id_ndf + '-' +element.nom_service + '-' + element.prenom_collab + 
      '-' + element.nom_collab + '-' + this.listemois[element.mois] + '-' + element.annee;
    var encrypted = this.encrypt(hiddenParam, this.key);
    this.router.navigate(['/servicecompta',  encrypted.toString()  ]);
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
