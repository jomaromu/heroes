import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: HeroeModel[] = [];
  cargando = false;

  constructor(private heroesService: HeroesService) { }

  ngOnInit() {

    // llamar a cargando mientreas obtengo todos los heroes
    this.cargando = true;

    this.heroesService.getHeroes()
      .subscribe(resp => {
        this.heroes = resp;

        // quitar cargando
        this.cargando = false;
      });
  }

  borrarHeroe(heroe: HeroeModel, i: number) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Seguro desea borrar a: ${heroe.nombre}`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.heroes.splice(i, 1);
        this.heroesService.borrarHeroe(heroe.id)
          .subscribe();
        Swal.fire({
          title: 'Información',
          text: ` ${heroe.nombre} Borrado`,
          type: 'info',
          animation: true,
        });
      } else {
        Swal.fire({
          title: 'Información',
          text: `Decidió no borrar a: ${heroe.nombre}`,
          type: 'info',
          animation: true,
        });
      }
    });

  }

}
