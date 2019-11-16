import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RoutesPath } from "../../app.module";
import { LoginAuthService } from "../../services/auth.services";
import { BaseComponent } from "../base.component";
import { PokemonService } from "./../../services/pokemon.services";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html"
})
export class DetailsView extends BaseComponent implements OnInit {
  public pokemon;
  public moves = [];
  public evols = [];
  public loginMessage: string;
  constructor(
    router: Router,
    formBuilder: FormBuilder,
    route: ActivatedRoute,
    public authService: LoginAuthService,
    public pokemonService: PokemonService
  ) {
    super(router, formBuilder, route);
  }

  private loadMovesData() {
    this.addMask("pokemonsMoves");
    this.pokemonService
      .getMovesByNames(this.pokemon.moves)
      .subscribe((response: any) => {
        this.moves = response;
        this.removeMask("pokemonsMoves");
      });
  }

  private loadEvolsData() {
    this.addMask("pokemonsEvols");
    this.pokemonService
      .getPokemonEvols(this.pokemon.id)
      .subscribe((response: any) => {
        const names = [];
        const evoChain = [];
        let evoData = response.chain;
        do {
          const evoDetails = evoData.evolution_details[0];
          names.push(evoData.species.name);
          evoChain.push({
            name: evoData.species.name,
            item: !evoDetails ? null : evoDetails.item,
            level: !evoDetails ? 1 : evoDetails.min_level,
            trigger: !evoDetails ? null : evoDetails.trigger.name
          });
          evoData = evoData.evolves_to[0];
        } while (evoData && evoData.hasOwnProperty("evolves_to"));
        this.evols = evoChain;
        this.pokemonService.getPokemonsByNames(names).subscribe(pokemons => {
          this.evols.map(
            (item, index) =>
              (item.image = pokemons[index].sprites.front_default)
          );
        });

        this.removeMask("pokemonsEvols");
      });
  }

  public ngOnInit() {
    this.pokemon = this.getParameters();
    if (!this.pokemon || Object.values(this.pokemon).length === 0) {
      this.navigate(RoutesPath.HOME);
    }
    this.loadMovesData();
    this.loadEvolsData();
  }
}
