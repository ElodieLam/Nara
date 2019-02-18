import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ServicecomptaService } from '../servicecompta/servicecompta.service';
import { GestionnotedefraisService } from '../gestionnotedefrais/gestionnotedefrais.service'
import { ILignedefraisListe } from '../gestionnotedefrais/gestionnotedefrais.interface';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 
import { DialogRefuserLigneCompta } from './dialog-refuser-ligne.component';
import { LignedefraisService } from '../lignedefrais/lignedefrais.service';


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
  
    listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'montant', 'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'accepter', 'refuser', 'motif_refus'];
    listNotedefrais: ILignedefraisListe[] = [];
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
      private gestionnotedefraisService : GestionnotedefraisService,
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
      this.sub = this.servicecomptaService
        .getLignesdefraisFromIdNdf({ id_ndf : this.id_ndf })
        .subscribe( (data : ILignedefraisListe[]) => {
          this.listNotedefrais = data;
          // console.log(this.listNotedefrais)
          this.listNotedefrais.forEach(element => {
            // le cds peut acceder à accepter et refuser
            // le cds peut acceder à annuler
            element.modif = false;
            if(element.statut_ldf == 'attF' || element.statut_ldf == 'avattF')
              element.modif = true;
            
            element.avance = false;
            if(element.montant_estime)
              element.avance = true;
            if(element.montant_ldf > 0)
              element.montant_display = element.montant_ldf.toString();
            else
              element.montant_display = element.montant_avance + " / " + element.montant_estime;
          });
          this.dataSource = new MatTableDataSource<ILignedefraisListe>(this.listNotedefrais);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isDisabled = false;
      });
    }
  
    accepterLdf(id : number, avance : boolean, statut_ldf : String) {
      this.isDisabled = true;
      var statut = 0;
      if(avance && statut_ldf == 'avattF')
        statut = 6;
      else
        statut = 11;
      if(avance) {
        console.log('accepter avance ' + statut)
        // this.gestionnotedefraisService.updateStatutAvance(
        //   { id : id, motif : '', statut : stat }
        // );
        this.gestionnotedefraisService.updateAvancenotifToAndFromCompta( {
          id_ndf : this.id_ndf, motif : '', stat : statut, id_ldf : id, id_cds : 0
        });
      }
      else {
        console.log('accepter ldf ' + statut)
        this.gestionnotedefraisService.updateLdfnotifToAndFromCompta( {
          id_ndf : this.id_ndf, motif : '', stat : statut, id_ldf : id, id_cds : 0
        });
        // this.gestionnotedefraisService.updateStatutLignedefrais(
        //   { id : id, motif : '', statut : stat }
        // );
      }
      this.delay(1500).then(any => {
        this.refreshLignes();
      });
    }
  
    refuserLdf(id : number, avance : boolean, statut : string) {
      const dialogRef = this.dialog.open(DialogRefuserLigneCompta, {
        data: { id : id, avance : avance, statut : statut, id_ndf : this.id_ndf }
      });
      dialogRef.afterClosed().subscribe(res => {
        this.delay(1500).then(any => {
          this.refreshLignes();
        });
      });
    }
  
  
    retourGestionNdf() {
      // var toCompta = false;
      // var fromCompta = false;
      // this.listNotedefrais.forEach( element => {
      //   if(element.statut_ldf == 'attF' || element.statut_ldf == 'avattF')
      //     toCompta = true;
      //   if(element.statut_ldf == 'noCds' || element.statut_ldf == 'avnoCds')
      //     fromCompta = true;
      // })
      // console.log('to ' + toCompta + ' from ' + fromCompta)
      // this.gestionnotedefraisService.createOrUpdateAllNotifications(
      //   { id_ndf : this.id_ndf, id_cds : this.id_cds }
      // )
      // // TODO use router as soon the query success
      // const dialogRef = this.dialog.open(DialogEnvoyer);
      // dialogRef.afterClosed().subscribe(() => {});
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