import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ServicecomptaService } from '../servicecompta/servicecompta.service';
import { ILignedefraisListe } from '../gestionnotedefrais/gestionnotedefrais.interface';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 
import { DialogRefuserLigneCompta } from './dialog-refuser-ligne.component';
import { DialogAccepterAvanceCompta } from './dialog-accepter-avance.component';



@Component({
  selector: 'app-servicecomptandf',
  templateUrl: './servicecomptandf.component.html',
  styleUrls: ['./servicecomptandf.component.css']
})

export class ServicecomptandfComponent implements OnInit {
  
    id_cds:number;
    id_ndf:number;
    nom:String = '';
    prenom:String ='';
    mois:String = '';
    annee:String = '';
    service:String = '';
    id_collab:number = 0;
    str:String[] = [];
    isDisabled:boolean = true;
    alreadyChecked:boolean = false;
    possiblendf:boolean = false;
    possibleavance:boolean = false;
    ndfalreadysent:boolean = false;
    newMonth: number = 0;
    newYear: number = 0;

    listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'montant', 'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'motif_refus'];
    listNotedefrais: ILignedefraisListe[] = [];
    listlignedefrais: ILignedefraisListe[] = [];
    listavance: ILignedefraisListe[] = [];
    dataSource;
    sub : any;
  
    //Variable pour encrypt/decrypt
    keySize: number = 256;
    ivSize : number = 128;
    iterations : number = 100;
    key  : any = "daouda";
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(private servicecomptaService : ServicecomptaService,
      private login : LoginComponent, private route : ActivatedRoute,
      private dialog: MatDialog, private router : Router) { }
  
    ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
  
        var decrypted = this.decrypt(params['id'], this.key);
        //console.log("Param decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));
        this.str = decrypted.toString(CryptoJS.enc.Utf8).split('-', 6);
        console.log(this.str)
        this.id_ndf = +this.str[0];
        this.service = this.str[1];
        this.prenom = this.str[2];
        this.nom = this.str[3];
        this.mois = this.str[4];
        this.annee = this.str[5];
      });
      this.id_cds = this.login.user.id_collab;
      this.refreshLignes();
    }
  
    refreshLignes() {
      this.listlignedefrais = [];
      this.listavance = [];
      this.alreadyChecked = false;
      this.possiblendf = false;
      this.possibleavance = false;
      this.sub = this.servicecomptaService
        .getLignesdefraisFromIdNdf({ id_ndf : this.id_ndf })
        .subscribe( (data : ILignedefraisListe[]) => {
          this.listNotedefrais = data;
          console.log(this.listNotedefrais)
          this.listNotedefrais.forEach(element => {
            if(!this.alreadyChecked)
              (element.statut_ldf == 'noF' || element.statut_ldf == 'val') ? this.alreadyChecked = true : {} ;
            if(!this.possiblendf)
              (element.statut_ldf == 'attF') ? this.possiblendf = true : {} ;
            if(!this.possibleavance)
              (element.statut_ldf == 'avattF') ? this.possibleavance = true : {} ;
            if(!this.ndfalreadysent)
              (element.statut_ldf == 'val') ? this.ndfalreadysent = true : {} ;
            if(element.statut_ldf == 'avattF') {
              element.avacceptable = true;
              element.avrefutable = true;
            }
            if(element.statut_ldf == 'avattCds' || element.statut_ldf == 'avnoCds'
            || element.statut_ldf == 'avattF' || element.statut_ldf == 'avval')
              this.listavance.push(element);
            else
              this.listlignedefrais.push(element);
        
          });
          this.dataSource = new MatTableDataSource<ILignedefraisListe>(this.listlignedefrais);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isDisabled = false;
          if(+this.mois == 12) {
            this.newMonth = 1;
            this.newYear = +this.annee + 1;
          }
          else {
            this.newMonth = this.listemois.indexOf(this.mois.toString()) + 1;
            this.newYear = +this.annee;
          }
          console.log(this.newMonth)
          console.log(this.newYear)
          console.log(this.ndfalreadysent)
       });
    }

    accepterLignes() {
      this.servicecomptaService
        .accepterLignes({
          id_ndf : this.id_ndf
        });
      this.delay(1500).then(any => {
        this.refreshLignes();
      });
    }
    refuserLignes(id: number) {
      const dialogRef = this.dialog.open(DialogRefuserLigneCompta, {
        data: { motif : '' }
      });
      dialogRef.afterClosed().subscribe(res => {
        console.log(res)
        if(res.motif != '') {
          console.log('service')
          this.servicecomptaService
            .refuserLignes({
              id_ndf : this.id_ndf, motif : res.motif
            });
          this.delay(1500).then(any => {
            this.refreshLignes();
          });
        }
      });
    }

    accepterAvance(id : number) {
      console.log(this.ndfalreadysent)
      if(this.ndfalreadysent){
        const dialogRef = this.dialog.open(DialogAccepterAvanceCompta, {
          data: { id_ldf : id, id_ndf : this.id_ndf, newNdf : this.ndfalreadysent, 
            newMonth : this.newMonth, newYear : this.newYear, nom_collab : this.nom }
        });
        dialogRef.afterClosed().subscribe(res => {
          this.delay(1500).then(any => {
            this.refreshLignes();
          });
        });
      }
      else {
        this.servicecomptaService
        .accepterAvance({
          id_ldf : id, id_ndf : this.id_ndf, newNdf : this.ndfalreadysent, 
          newMonth : this.newMonth, newYear : this.newYear, nom_collab : this.nom
        })
        this.delay(1500).then(any => {
          this.refreshLignes();
        });
      }
    }

    refuserAvance(id : number) {
      const dialogRef = this.dialog.open(DialogRefuserLigneCompta, {
        data: { id_ldf : id, motif : '', id_ndf : this.id_ndf }
      });
      dialogRef.afterClosed().subscribe(res => {
        this.delay(1500).then(any => {
          this.refreshLignes();
        });
      });
    }
    

    refuserAllAvance() {

    }

    transfromStatut(statut : string) {
      if(statut == 'val')
        return 'Validée'
      else if(statut == 'attF')
        return 'Attente compta'
      else if(statut == 'noF')
        return 'Refusée compta'
    }
  
    async delay(ms: number) {
      await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
    }
  
    decrypt (transitmessage, key) {
      var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
      var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
      var encrypted = transitmessage.substring(64);
  
      var key = CryptoJS.PBKDF2(key, salt, {
        keySize: this.keySize/32,
        iterations: this.iterations
      });
  
      var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
        iv: iv, 
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC  
      })
      return decrypted;
    }
  
  }