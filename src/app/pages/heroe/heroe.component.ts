import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HeroeModel } from '../../models/heroe.model';
import { HeroesService } from '../../services/heroes.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {


  heroe = new HeroeModel();

  constructor(private heroesService: HeroesService, private route: ActivatedRoute) { }

  ngOnInit() {

    // obtengo el parametro que pasa por id
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {

      this.heroesService.getHeroe(id)
        .subscribe( (resp: HeroeModel) => {
          this.heroe = resp;
          this.heroe.id = id;
          console.log(this.heroe);
        });
    }
  }

  guardar(form: NgForm) {

    if (form.invalid) {
      console.log('formulario no válido');
      Swal.fire({
        title: 'Mensaje',
        text: 'Formulario no válido',
        allowOutsideClick: false,
        type: 'warning'
      });
      return;
    }

    // usando en sweet alert antes de la creacion o acutalización
    Swal.fire({
      title: 'Espere',
      text: 'Gurdando información',
      type: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    // let crear observables
    let peticion: Observable<any>;

    if (this.heroe.id) {
      // acutalizar heroe
      peticion = this.heroesService.actualizarHeroe(this.heroe);
          // .subscribe( resp => {
          //   console.log(resp);
          // });
    } else {
      // crear heroe
      peticion = this.heroesService.crearHeroe(this.heroe);
        // .subscribe( resp => {
        //   console.log(resp);
        // });
    }

    peticion.subscribe(resp => {

      Swal.fire({
        title: this.heroe.nombre,
        text: 'Se actualizó correctamente',
        type: 'success',
      });
    });

  }

}
