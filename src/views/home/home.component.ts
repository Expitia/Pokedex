import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { RoutesPath } from "../../app.module";
import { BaseComponent } from "../base.component";
import { PokemonService } from "./../../services/pokemon.services";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html"
})
export class HomeView extends BaseComponent implements OnInit {
  public index = 0;
  private writedText;
  private selectedType;
  public pokemons = [];
  public types: string[] = [];
  private lastPageLoaded = [];
  private lastPokemonFilters = [];
  private pokemonsNames: string[] = [];

  constructor(
    router: Router,
    formBuilder: FormBuilder,
    public pokemonService: PokemonService
  ) {
    super(router, formBuilder);
  }

  private parsePokemonResponse = pokemon => ({
    id: pokemon.id,
    name: pokemon.name,
    weight: pokemon.weight,
    height: pokemon.height,
    image: pokemon.sprites.front_default,
    types: pokemon.types.map(
      item => item.type.name.charAt(0).toUpperCase() + item.type.name.slice(1)
    ),
    moves: pokemon.moves.map(move => move.move.name)
  });

  private loadPokemonPage(direction?, index?) {
    this.addMask("navPokemonList");
    if (direction) this.index += direction === "R" ? 1 : -1;
    if (index) this.index = index;
    this.pokemonService
      .getPokemonList(this.index)
      .subscribe((response: any) => {
        this.pokemons = Array.isArray(response)
          ? response.map(this.parsePokemonResponse)
          : [];
        this.lastPageLoaded = this.pokemons;
        this.removeMask("navPokemonList");
      });
  }

  private loadPokemonsNames() {
    this.addMask("pokemonsNames");
    this.pokemonService.getPokemonsNames().subscribe((response: any) => {
      this.pokemonsNames = response.results.map(item => item.name);
      this.removeMask("pokemonsNames");
    });
  }

  private loadPokemonsTypes() {
    this.addMask("pokemonsTypes");
    this.pokemonService.getPokemonsTypes().subscribe((response: any) => {
      this.types = response.results.map(
        item => item.name.charAt(0).toUpperCase() + item.name.slice(1)
      );
      this.removeMask("pokemonsTypes");
    });
  }

  private loadPokemonsByNames(names) {
    this.addMask("pokemonsByNames");
    this.pokemonService.getPokemonsByNames(names).subscribe((response: any) => {
      this.pokemons = response.map(this.parsePokemonResponse);
      this.lastPokemonFilters = this.pokemons;
      this.removeMask("pokemonsByNames");
    });
  }

  private loadPokemonsByType(type, filterByWrited?) {
    this.addMask("pokemonsByType");
    this.pokemonService.getPokemonsByType(type).subscribe((response: any) => {
      this.pokemons = response.map(this.parsePokemonResponse);
      this.lastPokemonFilters = this.pokemons;
      filterByWrited && this.onWriteSearch();
      this.removeMask("pokemonsByType");
    });
  }

  public ngOnInit() {
    this.loadPokemonPage();
    this.loadPokemonsTypes();
    this.loadPokemonsNames();
  }

  public onNav(direction: "L" | "R") {
    this.loadPokemonPage(direction);
  }

  public onWriteSearch(event?) {
    const value = event
      ? event.srcElement.value.toLowerCase()
      : this.writedText;
    this.writedText = value;

    const names = this.pokemonsNames.filter(item => item.includes(value));

    if (value.length >= 3 && !this.selectedType) {
      this.loadPokemonsByNames(names);
    } else if (value.length > 0 && this.selectedType) {
      this.pokemons = this.pokemons.filter(item => item.name.includes(value));
    } else if (!value && this.selectedType) {
      this.pokemons = this.lastPokemonFilters;
    } else this.pokemons = this.lastPageLoaded;
  }

  public onSelectType(event) {
    const value = event.srcElement.value.toLowerCase();
    this.selectedType = value;

    if (value && !this.writedText) this.loadPokemonsByType(value);
    else if (value && this.writedText) this.loadPokemonsByType(value, true);
    else if (!value && this.writedText && this.writedText.length >= 3) {
      this.onWriteSearch();
    } else this.pokemons = this.lastPageLoaded;
  }

  public onClickResult(data) {
    this.navigate(RoutesPath.DETAILS, data);
  }

  public onWritePage(event) {
    this.loadPokemonPage(
      null,
      Number(event.srcElement.value.replace(/\D+/g, ""))
    );
  }
}
