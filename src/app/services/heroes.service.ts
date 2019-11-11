import { Injectable } from '@angular/core';

// poder utilizar servicios http (get, post, put, delete etc)
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
// transformar la informacion de un observador
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url = 'https://heroes-d7657.firebaseio.com';

  constructor(private http: HttpClient) {
    //
  }

  // crear un heroe
  crearHeroe(heroe: HeroeModel) {

    return this.http.post(`${this.url}/heroes.json`, heroe)
      .pipe(
        map((resp: any) => {
          heroe.id = resp.name;
          return heroe;
        })
      );
  }

  // actualiza un heroe
  actualizarHeroe(heroe: HeroeModel) {

    // objeto con el opeardor spread
    const heroeTemp = {
      ...heroe
    };

    // borrar el id de mi temp
    delete heroeTemp.id;

    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemp); // .json solo para firebase
  }

  // obtener un heroe
  getHeroe(id: string) {
    return this.http.get(`${this.url}/heroes/${id}.json`);
  }

  // obtener todos los herores
  getHeroes() {
    return this.http.get(`${this.url}/heroes.json`)
      .pipe(
        map( resp => {
          return this.crearArreglos(resp);
        }), delay(1500));
  }

  /* pasar los objetos traidos de firebas a objetos que pueda ser
  iterados para poderlos mostrar al usuario */
  private crearArreglos(heroesObj: object) {

    // si la base de datos esta vacia
    if (heroesObj === null) {

      return [];
    }

    // convertir la informacion en un arreglo
    const heroes: HeroeModel[] = [];

    // Object.key() para crear un array con el valor del name del objeto
    Object.keys(heroesObj).forEach(key => {

      const heroe: HeroeModel = heroesObj[key];
      // agragando el id al nuevo objeto
      heroe.id = key;

      // agregando todos los heroes a la variable heroe
      heroes.push(heroe);
    });
    return heroes;
  }

  // eliminar un heroe
  borrarHeroe(id: string) {
    return this.http.delete(`${this.url}/heroes/${id}.json`);
  }
}
