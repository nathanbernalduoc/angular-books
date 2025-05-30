import { Component, OnInit } from '@angular/core';
import { ForoService } from '../../services/foro.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [ CommonModule, HttpClientModule ],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css',
  providers: [ForoService, HttpClient]
})

export class DetalleComponent implements OnInit {

  foroId: number = 0;
  comentario: any = [];
  foroParam: String = "";
  idNew: number = 0;
  miFormulario!: FormGroup;
  resultado:string = '';
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private jsonService: ForoService,
    private activatedRoute: ActivatedRoute) {}
  
  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe( params => {
        this.foroId = parseInt(params.get("foroId") || "0");
      }
    )

    this.miFormulario = this.fb.group({
      comentarioId: [''],
      foroId: [''],
      usuarioId: [''],
      comentario: ['', Validators.required],
      registroFecha: ['', Validators.required]
    });

  }

  getComentarios() {

    this.jsonService.getForoDataItem(this.foroId).subscribe(
      valor => {
        console.log("Recuperando foros "+JSON.stringify(valor));
        this.comentario = valor;
      },
      error => {
        console.log("Se ha producido un error\nApi Recover error: "+error.message+" / "+error.status);
      },
      () => { console.log('Ending!'); } 
    );


  }

  goForo(): void {
    this.router.navigate(['foro', []]);
  }

  submitForm() {

    console.log(this.comentario.length);
    this.idNew = this.comentario.length ? this.comentario[this.comentario.length-1].id + 1:1;

    console.log('Validando');
    this.comentario = this.miFormulario.get('comentario')!.value;

    let usuarioId: number = 1;

    this.jsonService.setComentarioData(1, this.foroId, usuarioId, this.comentario).subscribe(
      valor => {
        console.log("Feedback inserción foro "+JSON.stringify(valor));
        this.comentario = valor;
        this.getComentarios();
      },
      error => {
        console.log("Se ha producido un error\nApi Recover error: "+error.message+" / "+error.status);
      },
      () => { console.log('Ending!'); } 
    );


  }

}
