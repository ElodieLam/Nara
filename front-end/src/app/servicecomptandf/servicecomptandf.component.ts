import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { ServicecomptaService } from '../servicecompta/servicecompta.service';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 
import { DialogRefuserLigneCompta } from './dialog-refuser-ligne.component';
import { DialogAccepterAvanceCompta } from './dialog-accepter-avance.component';
import { SnackBarComponent } from '../lignedefrais/lignedefrais.component';
import { ILignedefrais } from '../servicecompta/servicecompta.interface';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-servicecomptandf',
  templateUrl: './servicecomptandf.component.html',
  styleUrls: ['./servicecomptandf.component.css'],
  providers: [DatePipe]
})
/**
 * Responsable : Alban Descottes
 * Component qui affiche la gestion d'une note de frais d'un collaborateur
 * Accessible pour le service compta
 * Version mobile et oridinateur
 */
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
    dataSource;
    displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'montant', 'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'motif_refus'];
    dataSourceMobile;
    displayedColumnsMobile: string[] = ['ldf'];
    listNotedefrais: ILignedefrais[] = [];
    listlignedefrais: ILignedefrais[] = [];
    listavance: ILignedefrais[] = [];
    cntLignesdefrais:number = 0;
    sub : any;
    mobileVersion:boolean = false;
  
    //Variable pour encrypt/decrypt
    keySize: number = 256;
    ivSize : number = 128;
    iterations : number = 100;
    key  : any = "daouda";
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(private servicecomptaService : ServicecomptaService,
      private login : LoginComponent, private route : ActivatedRoute,
      private dialog: MatDialog, private router : Router, private snackBar: MatSnackBar,
      private datePipe: DatePipe) {
        this.mobileVersion = this.login.mobileVersion;
       }
  
    ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
  
        var decrypted = this.decrypt(params['id'], this.key);
        this.str = decrypted.toString(CryptoJS.enc.Utf8).split('-', 6);
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
      this.cntLignesdefrais = 0;
      this.sub = this.servicecomptaService
        .getLignesdefraisFromIdNdf({ id_ndf : this.id_ndf })
        .subscribe( (data : ILignedefrais[]) => {
          this.listNotedefrais = data;
          this.listNotedefrais.forEach(element => {
            if(element.statut_ldf != 'avnoSent' && element.statut_ldf != 'avattCds' &&
            element.statut_ldf != 'avattF' && element.statut_ldf != 'avnoCds' &&
            element.statut_ldf != 'avnoF')
              this.cntLignesdefrais++;
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
            if(element.montant_avance == null) {
              if(element.statut_ldf != 'noSent' && element.statut_ldf != 'noCds' &&
              element.statut_ldf != 'attCds')
                this.listlignedefrais.push(element);
            }
            else {
              if(element.statut_ldf != 'avnoSent' && element.statut_ldf != 'avattCds' &&
              element.statut_ldf != 'avnoCds') {
                if(element.id_ndf != this.id_ndf) {
                  if(element.id_ndf_ldf == this.id_ndf) {
                    if(element.statut_ldf != 'noSent' && element.statut_ldf != 'noCds' &&
                    element.statut_ldf != 'attCds') 
                      this.listlignedefrais.push(element);
                  }
                }
                else {
                  if(element.id_ndf_ldf != this.id_ndf) {
                    this.listavance.push(element);
                  }
                  else {
                    this.listavance.push(element);
                    if(element.statut_ldf != 'avattCds' && element.statut_ldf != 'avnoCds'
                    && element.statut_ldf != 'avattF' && element.statut_ldf != 'avnoF') {
                      if(element.statut_ldf != 'noSent' && element.statut_ldf != 'noCds' &&
                      element.statut_ldf != 'attCds') 
                        this.listlignedefrais.push(element);
  
                    }
                  }
                }
              }
            }        
          });
          if(this.mobileVersion) {
            this.dataSourceMobile = new MatTableDataSource<ILignedefrais>(this.listlignedefrais);
            this.dataSourceMobile.paginator = this.paginator;
          }
          else {
            this.dataSource = new MatTableDataSource<ILignedefrais>(this.listlignedefrais);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          this.isDisabled = false;
          if(+this.mois == 12) {
            this.newMonth = 1;
            this.newYear = +this.annee + 1;
          }
          else {
            this.newMonth = this.listemois.indexOf(this.mois.toString()) + 1;
            this.newYear = +this.annee;
          }
       });
    }

    accepterLignes() {
      if(this.cntLignesdefrais == this.listlignedefrais.length) {
        this.servicecomptaService
        .accepterLignes({
          id_ndf : this.id_ndf
        });
        this.delay(1500).then(any => {
          this.openSnackBar('Note de frais acceptée !', 750);
          this.refreshLignes();
        });
      }
      else {
        this.openSnackBar('Impossible ! Toutes les lignes ne sont pas reçues.', 750);
      }
    }
    refuserLignes(id: number) {
      if(this.cntLignesdefrais == this.listlignedefrais.length) {
        const dialogRef = this.dialog.open(DialogRefuserLigneCompta, {
          data: { motif : '' }
        });
        dialogRef.afterClosed().subscribe(res => {
          if(res.motif != '') {
            this.servicecomptaService
              .refuserLignes({
                id_ndf : this.id_ndf, motif : res.motif
              });
            this.delay(1500).then(any => {
              this.openSnackBar('Note de frais refusée !', 750);
              this.refreshLignes();
            });
          }
        });
      }
      else {
        this.openSnackBar('Impossible ! Toutes les lignes ne sont pas reçues.', 750);
      }
    }

    accepterAvance(element : ILignedefrais) {
      var date = new Date(element.date_mission.toString())
      date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
      var str = this.datePipe.transform(date, 'yyyy-MM-dd').split("-",2);
      var str2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd').split("-",2);
      if(str[0] != str2[0] || str[1] != str2[1]) {
        const dialogRef = this.dialog.open(DialogAccepterAvanceCompta, {
          data: { id_ldf : element.id_ldf, id_ndf : this.id_ndf, newNdf : true, 
            newMonth : str[1], newYear : str[0], nom_collab : this.nom }
        });
        dialogRef.afterClosed().subscribe(res => {
          if(res == false) {
            this.openSnackBar('annulé', 750);

          }
          else {
            this.delay(1500).then(any => {
              this.openSnackBar('Avance acceptée !', 750);
              this.refreshLignes();
            });
          }
        });
      } 
      else {

        if(this.ndfalreadysent){
          
          const dialogRef = this.dialog.open(DialogAccepterAvanceCompta, {
            data: { id_ldf : element.id_ldf, id_ndf : this.id_ndf, newNdf : true, 
              newMonth : this.newMonth, newYear : this.newYear, nom_collab : this.nom }
          });
          dialogRef.afterClosed().subscribe(res => {
            if(res == false) {
              this.openSnackBar('annulé', 750);

            }
            else {
              this.delay(1500).then(any => {
                this.openSnackBar('Avance acceptée !', 750);
                this.refreshLignes();
              });
            }
          });
        }
        else {
          this.servicecomptaService
          .accepterAvance({
            id_ldf : element.id_ldf, id_ndf : this.id_ndf, newNdf : false, 
            newMonth : this.newMonth, newYear : this.newYear, nom_collab : this.nom
          })
          this.delay(1500).then(any => {
            this.openSnackBar('Avance acceptée !', 750);
            this.refreshLignes();
          });
        }
      } 
    }

    refuserAvance(id : number) {
      const dialogRef = this.dialog.open(DialogRefuserLigneCompta, {
        data: { id_ldf : id, motif : '', id_ndf : this.id_ndf }
      });
      dialogRef.afterClosed().subscribe(res => {
        this.delay(1500).then(any => {
          this.openSnackBar('Avance refusée !', 750);
          this.refreshLignes();
        });
      });
    }
    
    transformStatut(statut : string) {
      if(statut == 'val')
        return 'Validée'
      if(statut == 'noF')
        return 'Refus de laCompta'
      if(statut == 'attF')
        return 'En attente de la Compta'
      return 'unknown'
    }

    openSnackBar(msg: string, duration : number) {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: duration,
        data : msg
      });
    }

    goBack() {
      this.router.navigate(['/servicecompta']);
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