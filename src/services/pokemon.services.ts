import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PokemonService {
  constructor(private http: HttpClient) {}

  private baseUrl = "https://pokeapi.co/api/v2/";

  public getPokemonList(lastIndex = 0) {
    const pokemonsObservable = new Observable(observer => {
      const allRequest = [];
      const trueIndex = (lastIndex + 1) * 50;
      for (let index = trueIndex - 49; index <= trueIndex; index++) {
        allRequest.push(
          this.http.get(`${this.baseUrl}pokemon/${index}`).toPromise()
        );
      }
      Promise.all(allRequest)
        .then(response => {
          observer.next(response);
          observer.complete();
        })
        .catch(() => {
          observer.next([]);
          observer.complete();
        });
    });
    return pokemonsObservable;
  }

  public getPokemonsNames() {
    const pokemonsObservable = new Observable(observer => {
      this.http
        .get(`${this.baseUrl}pokemon/?limit=100000/`)
        .toPromise()
        .then(response => {
          observer.next(response);
          observer.complete();
        });
    });
    return pokemonsObservable;
  }

  public getPokemonEvols(id) {
    const pokemonsObservable = new Observable(observer => {
      this.http
        .get(`${this.baseUrl}pokemon-species/${id}`)
        .toPromise()
        .then((spice: any) => {
          this.http
            .get(spice.evolution_chain.url)
            .toPromise()
            .then(evols => {
              observer.next(evols);
              observer.complete();
            });
        });
    });
    return pokemonsObservable;
  }

  public getPokemonsTypes() {
    const pokemonsObservable = new Observable(observer => {
      this.http
        .get(`${this.baseUrl}type/`)
        .toPromise()
        .then(response => {
          observer.next(response);
          observer.complete();
        });
    });
    return pokemonsObservable;
  }

  public getPokemonsByNames(names) {
    const pokemonsObservable = new Observable(observer => {
      const allRequest = names.map(name =>
        this.http.get(`${this.baseUrl}pokemon/${name}`).toPromise()
      );
      Promise.all(allRequest).then(response => {
        observer.next(response);
        observer.complete();
      });
    });
    return pokemonsObservable;
  }

  public getMovesByNames(names) {
    const pokemonsObservable = new Observable(observer => {
      const allRequest = names.map(name =>
        this.http.get(`${this.baseUrl}move/${name}`).toPromise()
      );
      Promise.all(allRequest).then(response => {
        observer.next(response);
        observer.complete();
      });
    });
    return pokemonsObservable;
  }

  public getPokemonsByType(type) {
    const pokemonsObservable = new Observable(observer => {
      this.http
        .get(`${this.baseUrl}type/${type}`)
        .toPromise()
        .then((response: any) => {
          this.getPokemonsByNames(
            response.pokemon.map(item => item.pokemon.name)
          ).subscribe(fullResponse => {
            observer.next(fullResponse);
            observer.complete();
          });
        });
    });
    return pokemonsObservable;
  }
}
